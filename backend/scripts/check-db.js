#!/usr/bin/env node
import dotenv from "dotenv";
import dns from "dns/promises";
import net from "net";
import mongoose from "mongoose";

dotenv.config();

const raw = process.env.DB_URL || process.env.DB_URI || process.argv[2];

function maskConnString(s) {
    if (!s) return s;
    return s.replace(/(mongodb(?:\+srv)?:\/\/)([^:@/]+)(:[^@/]*)?@/, (m, p1, user, pass) => `${p1}${user}:***@`);
}

if (!raw) {
    console.error("Usage: set DB_URL in env or pass it as the first arg");
    process.exit(2);
}

console.log("Checking MongoDB connection diagnostics for:", maskConnString(raw));

async function checkSrv(host) {
    try {
        const name = `_mongodb._tcp.${host}`;
        console.log(`Resolving SRV records for ${name} ...`);
        const records = await dns.resolveSrv(name);
        console.log(`SRV records (${records.length}):`);
        for (const r of records) console.log(` - ${r.name}:${r.port} (priority ${r.priority} weight ${r.weight})`);
        return records.map(r => r.name.replace(/\.$/, ''));
    } catch (err) {
        console.warn(`SRV lookup failed: ${err.code || err.message}`);
        return [];
    }
}

async function checkHostConnect(host, port = 27017, timeout = 3000) {
    return new Promise((resolve) => {
        const sock = new net.Socket();
        let settled = false;
        sock.setTimeout(timeout);
        sock.on('connect', () => {
            settled = true;
            sock.destroy();
            resolve({ ok: true });
        });
        sock.on('timeout', () => {
            if (!settled) { settled = true; sock.destroy(); resolve({ ok: false, error: 'timeout' }); }
        });
        sock.on('error', (err) => {
            if (!settled) { settled = true; resolve({ ok: false, error: err.message || err.code }); }
        });
        sock.connect(port, host);
    });
}

async function run() {
    try {
        const isSrv = raw.startsWith('mongodb+srv://');
        let hosts = [];

        if (isSrv) {
            // extract hostname between @ and first / or ?
            const afterAt = raw.split('@')[1] || raw;
            const hostPart = afterAt.split('/')[0].split('?')[0];
            const primaryHost = hostPart.split(',')[0];
            const resolved = await checkSrv(primaryHost);
            hosts = resolved.length ? resolved : [primaryHost];
        } else {
            // non-srv: hostname(s) before / and after mongodb://[user:pass@]
            const afterProto = raw.replace(/^mongodb:\/\//, '').replace(/^mongodb\+srv:\/\//, '');
            const hostPart = afterProto.split('@').pop().split('/')[0].split('?')[0];
            hosts = hostPart.split(',').map(h => h.split(':')[0]);
        }

        console.log('Hosts to test:', hosts.join(', '));

        for (const h of hosts) {
            try {
                console.log(`Checking TCP connect to ${h}:27017 ...`);
                // try both host and host without trailing dot
                const result = await checkHostConnect(h.replace(/\.$/, ''), 27017, 3000);
                console.log(` - ${h}:27017 -> ${result.ok ? 'reachable' : 'unreachable'}${result.error ? ` (${result.error})` : ''}`);
            } catch (err) {
                console.warn(` - ${h} check failed: ${err.message || err}`);
            }
        }

        console.log('\nAttempting mongoose connection (serverSelectionTimeoutMS=5000) ...');
        try {
            await mongoose.connect(raw, { serverSelectionTimeoutMS: 5000 });
            console.log('Mongoose connected successfully');
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.error('Mongoose connection failed:');
            console.error(err && err.message ? err.message : err);
            if (err && err.reason) console.error('Reason:', err.reason);
            process.exit(3);
        }

    } catch (err) {
        console.error('Unexpected error:', err.message || err);
        process.exit(4);
    }
}

run();

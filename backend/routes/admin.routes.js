// routes/admin.routes.js
router.post("/approve-seller/:userId", adminOnlyMiddleware, async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(userId, { 
    role: "seller",
    isSellerApproved: true 
  });
  res.json({ success: true, message: "User is now a seller!" });
});
(async () => {
  try {
    const { connectMongo } = await import('./config/mongo.js');
    const { createApp } = await import('./expressApp.js');

    const PORT = process.env.PORT || 3001;
    await connectMongo();
    const app = createApp();
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
})();
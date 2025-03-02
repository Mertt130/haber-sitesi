document.getElementById("newsForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Form verilerini al
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const textColor = document.getElementById("textColor").value;
    const fontSize = document.getElementById("fontSize").value;
    const category = document.getElementById("category").value;
    const videoUrl = document.getElementById("videoUrl").value;
    const imageFile = document.getElementById("image").files[0];

    // Firebase Firestore'a veri ekle
    try {
        let imageUrl = "";
        if (imageFile) {
            const storageRef = storage.ref('news_images/' + imageFile.name);
            await storageRef.put(imageFile);
            imageUrl = await storageRef.getDownloadURL();
        }

        await db.collection("news").add({
            title: title,
            content: content,
            textColor: textColor,
            fontSize: fontSize,
            category: category,
            videoUrl: videoUrl,
            imageUrl: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Haber başarıyla yayınlandı!");
        document.getElementById("newsForm").reset();
    } catch (error) {
        console.error("Hata:", error);
        alert("Haber yayınlanırken bir hata oluştu.");
    }
});

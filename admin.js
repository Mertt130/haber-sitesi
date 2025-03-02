document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("newsForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const textColor = document.getElementById("textColor").value;
        const textSize = document.getElementById("textSize").value;
        const category = document.getElementById("category").value;
        const videoUrl = document.getElementById("videoUrl").value;
        const imageFile = document.getElementById("image").files[0];

        if (!title || !content) {
            alert("Başlık ve içerik boş bırakılamaz!");
            return;
        }

        let imageUrl = "";
        if (imageFile) {
            const storageRef = firebase.storage().ref(`news_images/${imageFile.name}`);
            await storageRef.put(imageFile);
            imageUrl = await storageRef.getDownloadURL();
        }

        try {
            await firebase.firestore().collection("news").add({
                title,
                content,
                textColor,
                textSize,
                category,
                videoUrl,
                imageUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("Haber başarıyla eklendi!");
            document.getElementById("newsForm").reset();
        } catch (error) {
            console.error("Hata oluştu:", error);
            alert("Haber eklenirken hata oluştu!");
        }
    });
});

document.getElementById("haberForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const baslik = document.getElementById("haberBaslik").value;
    const icerik = document.getElementById("haberIcerik").value;
    const renk = document.getElementById("haberRenk").value;
    const font = document.getElementById("haberFont").value;
    const tarih = new Date().toISOString();

    // Resim veya video dosyası seçilmişse Firebase Storage'a yükle
    const dosya = document.getElementById("haberDosya").files[0];
    let medyaURL = "";

    if (dosya) {
        const depolamaRef = firebase.storage().ref(`medya/${dosya.name}`);
        await depolamaRef.put(dosya);
        medyaURL = await depolamaRef.getDownloadURL();
    }

    // Haberi Firestore'a ekle
    db.collection("haberler").add({
        baslik,
        icerik,
        renk,
        font,
        medyaURL,
        tarih
    }).then(() => {
        alert("Haber başarıyla eklendi!");
        document.getElementById("haberForm").reset();
    }).catch(error => {
        console.error("Hata:", error);
    });
});

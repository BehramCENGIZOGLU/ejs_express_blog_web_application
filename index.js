// import işlemleri yapıldı.
import express from "express";
import bodyParser from "body-parser";

// get, post, listen işlemleri için app değişkenine express modülü atandı.
const app = express(); 

// port değişkenine 3000 atandı.
const port = 3000;

// boş bir dizi ayarlandı.
let posts=[];

// posts adında title ve content değerleri alan bir fonksiyon tanımlandı.
// bu fonksiyon içerisinde title, content, date değerleri tutuluyor. 
function Posts(title,content){
    this.title=title,
    this.content=content,
    this.rawDate = new Date();
    this.date = this.rawDate.toLocaleString();
}

// addPost adında bir fonksiyon oluşturuldu.
// amacı post adında ki değişkene posts fonksiyonunu çağırarak tiitle ve content içeriğini eklemek.
// daha sonra post değişkenine eklenen veriler posts dizine push edildi.
function addPost(title,content){
    let post = new Posts(title,content);
    posts.push(post);
}

// deletePost adında bir fonksiyon oluşturuldu bu sayede seçilen post'un silinmesi sağlandı.
function deletePost(index){
    posts.splice(index,1);
}

// editPost adında seçilen post'un düzenlenmesi için posts fonksiyonu çağırıldı.
// burada amaç seçilen postun önceki bilgilerinin üzerine bilgiler yazmak bu sayede en son yazılan bilgiler kalacaktır.
function editPost(index, title, content){
    posts[index] = new Posts(title, content);
}

// public klasörü içinde ki dosyalara tarayıcıdan erişilebilmesi sağlandı.
app.use(express.static("public"));

// formdan gelen verilerin ayrı ayrı alınabilmesi sağlandı.
app.use(bodyParser.urlencoded({extended:true}));

// ana sayfa ayarlandı.
// posts içerisinde ki bilgiler home.ejs kısmına aktarıldı.
app.get("/",(req,res) => {
    res.render("home.ejs",{posts:posts});
});

app.get("/create", (req,res) => {
    res.render("create.ejs");
});

// id'si seçilen post'un verileri view kısmında gösterildi. Örn : localhost:3000/view/0 gibi
app.get("/view/:id",(req,res) => {
    let index = req.params.id;
    let post = posts[index];
    res.render("view.ejs",{postId:index, title:post.title, content:post.content});
});

// seçili olan postun güncellenebilmesi için önceden yazılı olan bilgiler çekilip create.ejs kısmına gönderildi.
app.get("/edit/:id",(req,res) => {
    let index = req.params.id;
    let post = posts[index];
    res.render("create.ejs", {postId:index, title:post.title, content:post.content});
});

// seçili olan post'un silinme işlemi gerçekleştirildi.
app.post("/delete",(req,res) => {
    let index = req.body["postId"];
    deletePost(index);
    res.redirect("/");
});

// seçili olan postun index, title, content bilgileri alınıp editPost fonksiyonuna iletildi.
// böylece yeni veriler eski verilerin üzerine işlenmiş oldu.
app.post("/update",(req,res) => {
    let index = req.body.postId;
    let title = req.body.title;
    let content = req.body.content;
    editPost(index, title, content);
    res.redirect("/");
});

// create.ejs sayfasında title ve content bilgileri girildikten sonra kaydedilme işlemi yapıldı.
app.post("/save", (req,res) => {
    let title = req.body.title;
    let content = req.body.content;
    addPost(title,content);
    res.redirect("/");
});

// local'de 3000 numaralı portun dinlenmesi sağlandı.
// başlangıçta sabit olarak 2 post gösterildi. 
app.listen(port, () => {
    addPost("I Tried to Impress my Date with my Culinary Skills, and I Burned Water", "Hey fellow foodies, gather 'round for a tale of culinary calamity that would make Gordon Ramsay shed a tear.\nSo, picture this: a romantic dinner date with my crush, a beautifully set table, candles, and soft music playing in the background. I decided to take charge of the kitchen and show off my alleged culinary skills, thinking I'd impress my date with a homemade meal. What could go wrong, right?\nAs we embarked on this culinary adventure, I decided to start with something easy - boiling water for pasta. Sounds foolproof, doesn't it?\nBut it turns out, I have a knack for defying the odds.")
    addPost("I Pretended to Be a Penguin on a Job Interview - Now I'm the New Zoo Attraction", "Hello, my adoring fans! Allow me to regale you with the audacious tale of how my penguin impersonation turned me into the zoo's most celebrated attraction.\nOne day, in a moment of pure genius, I transformed into the charismatic Penguin Pretender. I walked into the zoo, flaunting my exceptional penguin moves, honks, and all. The interview panel was dumbstruck, offering me a job right then and there.\nFast forward to today, I'm the star of the show! My skills as the dazzling Penguin Pretender are unrivaled, drawing crowds from all over. I have a VIP enclosure, a daily 'Penguin Spectacle,' and a fervent fan following.\nMy message to you? Dare to be extraordinary, and let your talents shine.")
    console.log(`Breaking News: Our app is all ears at Port ${port}, ready to boogie to the sweet sounds of data! 🎵🕺😄`)
})

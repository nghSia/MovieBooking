const express = require('express')
const app = express()


const v_articles = [
    { id: 1, name: "Ordinateur Portable", category: "Informatique", price: 1200 },
    { id: 2, name: "Clavier Mécanique", category: "Informatique", price: 150 },
    { id: 3, name: "Écran 27 pouces", category: "Informatique", price: 300 },
    { id: 4, name: "Chaise Gaming", category: "Mobilier", price: 250 },
    { id: 5, name: "Bureau en bois", category: "Mobilier", price: 500 },
    { id: 6, name: "Souris sans fil", category: "Informatique", price: 50 },
    { id: 7, name: "Casque Audio", category: "Multimédia", price: 100 },
    { id: 8, name: "Smartphone", category: "Téléphonie", price: 900 },
    { id: 9, name: "Tablette Graphique", category: "Informatique", price: 250 },
    { id: 10, name: "Imprimante Laser", category: "Informatique", price: 200 }
];


const v_PORT = 3000;
app.listen(v_PORT, () => {
    console.log(`🚀 Server is running on port ${v_PORT}`);
});

function filterArticleByName(p_articles, p_searchName) {
    return p_articles.filter(p_articles => 
        p_articles.name.toLowerCase().includes(p_searchName.toLowerCase())
    );
}

function filterArticleByPrice(p_articles, p_searchPrice){
    return p_articles.filter(p_articles =>
        p_articles.price = p_searchPrice
    );
}

console.log(Array.isArray(v_articles));
console.log(typeof v_articles);


const v_searchOrdi = filterArticleByName(v_articles, "ordinateur");
console.log(v_searchOrdi);
const v_search250PriceTag = filterArticleByPrice(v_articles, 250);
console.log(v_search250PriceTag);
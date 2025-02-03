const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (p_req, p_res) => {
    p_res.send('Bienvenue dans l\'API');
});

function generateToken(p_user){
    const v_userJson = JSON.stringify(p_user);
    return btoa(v_userJson);
}

function verifyToken(p_token){
    const v_userJson = atob(p_token);
    return v_userJson;
}
  

app.post('generate', (p_req, p_res) =>{
    try{
        const v_user = p_req.body;
        const v_userToken = generateToken(v_user);
        return v_userToken;
    } catch {
        p_res.status(400).json({ error: "Traitement" })
    }
});


app.post('verify', (p_req, p_res) => {
    try{
        const v_userToken = p_req.body;
        const v_userJson = verifyToken(v_userToken);
        return v_userJson;
    }
    catch{
        p_res.status(400).json({ error: "Token incorrect" })
    }
});

const v_PORT = 3000;
app.listen(v_PORT, () => {
    console.log(`🚀 Server is running on port ${v_PORT}`);
});


const v_user = {
    id: 1,
    nom : 'Alex',
    mail : 'alex!@gmail.com'
}

const v_token = generateToken(v_user);
console.log("Token genere : " + v_token);

const v_userJson = verifyToken(v_token);
console.log("Utilisateur verifie : " + v_userJson);
const firebaseConfig = {
    apiKey: 'AIzaSyAh2I79zPc2EpGPvvrWtNw7d_fAayM2gAM',
    authDomain: 'i2-correpedidos.firebaseapp.com',
    databaseURL: 'https://i2-correpedidos-default-rtdb.firebaseio.com/',
    projectId: 'i2-correpedidos'
};
firebase.initializeApp(firebaseConfig);
// Obtener una referencia a Firestore
const firestore = firebase.firestore();

const pedidosCollection = firestore.collection('pedidosN');

function mostrar(){
    
const matricula = document.getElementById("Matricula").value.trim();
pedidosCollection.where('Matricula', '==', parseInt(matricula)).get().then((querySnapshot) => {
    container.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const pedidoData = doc.data();
        const div = document.createElement('div');
        div.classList.add('pedido');
        div.innerHTML = `<p>Pedido: ${pedidoData.NoPedido}</p>
        <p>fecha de pedido: ${pedidoData.Date}</p>
        <p>Menu: ${pedidoData.Articulo}</p>
        <p>Matricula: ${pedidoData.Matricula}</p>
        <p>Nombre: ${pedidoData.Nombre}</p> 
        <p>Pedido: Completado</p>`;

        container.appendChild(div);
    });
})
.catch((error) => {
    console.error("Error al obtener los pedidos:", error);
});

}
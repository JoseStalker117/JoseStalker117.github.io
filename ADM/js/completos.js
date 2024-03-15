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

pedidosCollection.where('Estado', '==', 1).onSnapshot((querySnapshot) => {
    container.innerHTML = '';
    const sortedDocs = querySnapshot.docs.sort((a, b) => {
        const noPedidoA = parseInt(a.data().NoPedido);
        const noPedidoB = parseInt(b.data().NoPedido);
        return noPedidoA - noPedidoB;
    });

    sortedDocs.forEach((doc) => {
        const data = doc.data();        
        const noPedido = data.NoPedido;
        const fechaPedido = data.Date;
        const Articulo = data.Articulo;
        const matricula = data.Matricula;
        const nombre = data.Nombre;

        const div = document.createElement('div');
        div.classList.add('pedido');
        div.innerHTML = `<p>Pedido: ${noPedido}</p>
                        <p>fecha de pedido: ${fechaPedido}</p>
                        <p>Menu: ${Articulo}</p>
                        <p>Matricula: ${matricula}</p>
                        <p>Nombre: ${nombre}</p> 
                        <p>Pedido: Completado</p>`;

        container.appendChild(div);
    });
});


const firebaseConfig = {
    apiKey: 'AIzaSyAh2I79zPc2EpGPvvrWtNw7d_fAayM2gAM',
    authDomain: 'i2-correpedidos.firebaseapp.com',
    databaseURL: 'https://i2-correpedidos-default-rtdb.firebaseio.com/',
    projectId: 'i2-correpedidos'
};
firebase.initializeApp(firebaseConfig);
// Obtener una referencia a Firestore
const firestore = firebase.firestore();
// Obtener una referencia a Firebase Realtime Database
const database = firebase.database();

const pedidosCollection = firestore.collection('pedidosN');
const LCD = database.ref('LCD');

pedidosCollection.where('Estado', '==', 0).onSnapshot((querySnapshot) => {
    container.innerHTML = '';

    // Convertir los documentos a un array y ordenarlos por el número de pedido
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
                        <p>Pedido: En proceso...</p>`;

        const btnEnProceso = document.createElement('button');
        btnEnProceso.textContent = 'Completar';
        btnEnProceso.classList.add('button');
        btnEnProceso.addEventListener('click', function(event) {
            event.stopPropagation(); 
            if (confirm('¿Está seguro de completar el pedido?')) {
                doc.ref.update({ Estado: 1 })
                .then(() => {
                    div.remove();
                    const pedidoData = {
                        Estado: 1,
                        Matricula: parseInt(matricula),
                        NoPedido: parseInt(noPedido),
                        Nombre: nombre
                    };
                    LCD.child('pedido').set(pedidoData);
                })
                .catch((error) => {
                    console.log("Error al completar el pedido:", error);
                });
            }
        });
        div.appendChild(btnEnProceso);

        const btnCancel = document.createElement('button');
        btnCancel.textContent = 'Cancelar';
        btnCancel.classList.add('button', 'cancel');
        btnCancel.addEventListener('click', function(event) {
            event.stopPropagation(); 
            if (confirm('¿Está seguro de cancelar el pedido?')) {
                doc.ref.update({ Estado: 2 })
                .then(() => {
                    div.remove();
                })
                .catch((error) => {
                    console.log("Error al cancelar el pedido:", error);
                });
            }
        });
        div.appendChild(btnCancel);

        container.appendChild(div);
    });
});


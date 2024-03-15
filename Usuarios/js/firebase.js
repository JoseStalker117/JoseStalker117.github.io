firebase.default.initializeApp({
    apiKey: 'AIzaSyAh2I79zPc2EpGPvvrWtNw7d_fAayM2gAM',
    authDomain: 'i2-correpedidos.firebaseapp.com',
    databaseURL: 'https://i2-correpedidos-default-rtdb.firebaseio.com/',
    projectId: 'i2-correpedidos',
    storageBucket: "i2-correpedidos.appspot.com",
    messagingSenderId: "470149658124",
    appId: "1:470149658124:web:d428b94592bef4e7bfa029",
    measurementId: "G-N08V5EBXR0"
});

// INICIANDO Firebase DATABASE NUBE - VISTA DEL MENU 
var db = firebase.firestore();
var tabla = document.getElementById('tabla');

db.collection("articulos").where("Activo", "==", true).onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().Nombre}`);
        tabla.innerHTML += `
                            <tr>
                                <td style="display: none;">${doc.id}</td>
                                <td>${doc.data().Descripcion}</td>
                                <td>${doc.data().Nombre}</td>
                                <td style="text-align: center;">${doc.data().Precio}</td>
                                <td style="display:none;">${doc.data().imagen}</td>
                                <td><button id="comprar" onclick="comprar('${doc.id}', '${doc.data().Nombre}')">Comprar</button></td>
                            </tr>
                            `
    });
});

// BOTON DE COMPRAR
function comprar(id, Nombre) {
    if (confirm('¿Está seguro de comprar el menú?')) {
        document.getElementById('formulario').style.display = 'block';
        document.getElementById('articuloId').value = id;
        document.getElementById('articuloNombre').value = Nombre;
    }
}

// FORMULARIO QUE SE MOSTRARA CUANDO EL USUARIO DE QUE SI AL MOMENTO DE COMPRAR
function pedir() {
    console.log("La función pedir() ha sido llamada.");
    var matricula = document.getElementById('matricula').value;
    var nombre = document.getElementById('nombre').value;
    var Nombre = document.getElementById('articuloNombre').value;

    // VALIDA QUE LOS CAMPOS NO SE ENCUENTREN VACIOS
    if (matricula === '' || nombre === '') {
        alert("Por favor, complete todos los campos del formulario.");
        return;
    }

    // OBTENER EL ÚLTIMO NÚMERO DE PEDIDO REGISTRADO
    db.collection("pedidosN").orderBy("NoPedido", "desc").limit(1).get()
    .then(querySnapshot => {
        let noPedido = 1; // Si no hay pedidos previos, se iniciará desde 1
        if (!querySnapshot.empty) {
            // Si hay pedidos previos, incrementa el número de pedido en 1
            noPedido = querySnapshot.docs[0].data().NoPedido + 1;
        }

    // TRAEMOS LA FUNCION DE obtenerFechaActual
    const fechaActual = obtenerFechaActual();

    // CREAMOS LA COLLECTION pedidosN en FIRESTORE
    db.collection("pedidosN").add({
        Date: fechaActual,
        NoPedido: noPedido,
        Estado: 0,
        Matricula: parseInt(matricula),
        Nombre: nombre,
        Articulo: Nombre
    })
    // SE AGREGO CORRECTAMENTE
    .then(function(docRef) {
        console.log("Pedido creado con ID: ", docRef.id);
        alert("Pedido realizado con éxito.");
        document.getElementById('matricula').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('formulario').style.display = 'none';
    })
    // ERROR AL AGREGAR LA COLECCION
    .catch(function(error) {
        console.error("Error al crear el pedido: ", error);
        alert("Error al realizar el pedido. Por favor, inténtalo de nuevo.");
    });
})
.catch(error => {
    console.error("Error al obtener el último número de pedido: ", error);
    alert("Error al realizar el pedido. Por favor, inténtalo de nuevo.");
});
}

// FUNCION PARA OBTENER LA FECHA Y HORA ACTUAL
function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${hora}:${minutos}`;
}


/*
    // Inicializa Firebase Realtime Database
    var db2 = firebase.database();

    // Referencia a la base de datos en tiempo real
    const LCD = db2.ref('LCD');

    // Obtener un nuevo número de pedido
    LCD.child('pedido').once('value', snapshot => {
        const noPedido = snapshot.val().NoPedido + 1;

        // Actualizar datos en la base de datos en tiempo real
        LCD.child('pedido').update({
            Estado: 0,
            Matricula: parseInt(matricula),
            NoPedido: noPedido,
            Nombre: nombre
        }).then(() => {
            alert('Pedido realizado con éxito');
            // Ocultar el formulario después de realizar el pedido
            document.getElementById('matricula').value = '';
            document.getElementById('nombre').value = '';
            document.getElementById('formulario').style.display = 'none';
            document.getElementById('comprar').disabled = false; // Habilitar botón comprar
        }).catch(error => {
            console.error('Error al realizar el pedido:', error);
        });
    });*/
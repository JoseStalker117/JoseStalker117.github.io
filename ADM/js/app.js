firebase.default.initializeApp({
    apiKey: 'AIzaSyAh2I79zPc2EpGPvvrWtNw7d_fAayM2gAM',
    authDomain: 'i2-correpedidos.firebaseapp.com',
    projectId: 'i2-correpedidos'
});

// Iniciar Cloud Firestore
// Iniciar Cloud Firestore
var db = firebase.firestore();

// Variable global para almacenar el último ID registrado
var ultimoID;

// Función para obtener el último ID registrado
function obtenerUltimoID() {
    db.collection("articulos")
        .orderBy("Id", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ultimoID = doc.data().Id;
            });
        })
        .catch((error) => {
            console.error("Error al obtener el último ID: ", error);
        });
}

// Llamar a obtenerUltimoID() al cargar la página para inicializar ultimoID
obtenerUltimoID();

// Función para obtener el siguiente ID
function obtenerSiguienteID() {
    return ultimoID ? ++ultimoID : 1;
}

function btnRegistrar() {
    var formReg = document.getElementById("form-Reg");
    formReg.style.display = "block";
}

function registrar() {
    var Descripcion = document.getElementById('Descripcion').value.trim();
    var Nombre = document.getElementById('Nombre').value.trim();
    var Precio = document.getElementById('Precio').value.trim();

    // Verificar si los campos están llenos
    if (Descripcion === '' || Nombre === '' || Precio === '') {
        alert("Por favor, complete todos los campos del formulario.");
        return;
    }
    
    var nuevoID = obtenerSiguienteID();

    db.collection("articulos").add({
        Activo: true,
        Descripcion: Descripcion,
        Nombre: Nombre,
        Precio: parseInt(Precio),
        Id: nuevoID
    })
    .then((docRef) => {
        console.log("Se agregó correctamente: ", docRef.id);
        document.getElementById('Descripcion').value = "";
        document.getElementById('Nombre').value = "";
        document.getElementById('Precio').value = "";
        
        // Actualizar el último ID registrado
        ultimoID = nuevoID;

        var formReg = document.getElementById("form-Reg");
        formReg.style.display = "none";
    })
    .catch((error) => {
        console.error("Error al agregar: ", error);
    });
}

// Función para cancelar registro
function cancelarReg() {
    // Limpiamos el formulario y ocultamos el formulario de registro
    document.getElementById('Descripcion_Edit').value = '';
    document.getElementById('Nombre_Edit').value = '';
    document.getElementById('Precio_Edit').value = '';
    document.getElementById("form-Reg").style.display = "none";
}

// Adjuntar evento de clic para el botón "Cancelar"
document.getElementById("cancelarReg").addEventListener("click", cancelar);

function toggleActivo(docId, activo) {
    let confirmMessage;
    if (activo) {
        confirmMessage = "¿Está seguro de que desea desactivar este menú?";
    } else {
        confirmMessage = "¿Está seguro de que desea activar este menú?";
    }

    if (confirm(confirmMessage)) {
        const docRef = db.collection("articulos").doc(docId);

        return docRef.update({
            Activo: !activo
        })
        .then(() => {
            console.log("Documento actualizado exitosamente.");
        })
        .catch((error) => {
            console.error("Error al actualizar el documento:", error);
        });
    }
}


// Leer documentos
var tabla = document.getElementById('tabla');
// onSnapshot: estara escuchando los cambios que se esten haciendo en la base de datos
db.collection("articulos").onSnapshot((querySnapshot) => {
    // comenzara limpiado los datos de la tabla
    tabla.innerHTML = '';
    // forEach: son ciclos que se va a ir repitiendo por cada uno  de los objetos que esten creados
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().Nombre}`);
        // innerHTML: remplazamos lo que aparece en el html
        // +=: hace que se agrege una linea por cada ciclo y sea un nuevo dato
        tabla.innerHTML += `
                            <tr>
                                <td style="display: none;">${doc.id}</td>

                                <td>${doc.data().Activo}</td>
                                <td>
                                <button class="estado" onclick="toggleActivo('${doc.id}', ${doc.data().Activo})">
                                    ${doc.data().Activo ? '<i class="bx bx-lock-alt"></i>' : '<i class="bx bx-lock-open-alt"></i>'}
                                </button>
                            </td>

                                <td>${doc.data().Descripcion}</td>
                                <td style="display: none">${doc.data().Id}</td>
                                <td>${doc.data().Nombre}</td>
                                <td>${doc.data().Precio}</td>
                                <td style="display: none;">${doc.data().imagen}</td>
                                <td><button id="eliminar" onclick="eliminar('${doc.id}')"><i class='bx bx-trash'></i></button></td>
                                <td><button id="editar" onclick="editar('${doc.id}', '${doc.data().Descripcion}', '${doc.data().Nombre}', '${doc.data().Precio}', '${doc.data().imagen}')"><i class='bx bx-edit-alt'></i></button></td>   
                            </tr>
                            `
    });
});

//borrar documento
function eliminar(id){
    if (window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
        // Si el usuario confirma eliminara el documento
        db.collection("articulos").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
}

// editar documento
// Variable global para almacenar el ID del registro que estamos editando
var idActual = "";

// Función para cargar los datos en el formulario de edición
function cargarDatosEnFormulario(id, Descripcion, Nombre, Precio) {
    var formularioEdicion = document.getElementById("form-editar");
    formularioEdicion.style.display = "block";

    document.getElementById('Descripcion_Edit').value = Descripcion;
    document.getElementById('Nombre_Edit').value = Nombre;
    document.getElementById('Precio_Edit').value = Precio;

    // Actualizamos la variable global con el ID del registro actual
    idActual = id;
}

// Función para actualizar el documento en la base de datos
function actualizar() {
    var Descripcion = document.getElementById('Descripcion_Edit').value.trim();
    var Nombre = document.getElementById('Nombre_Edit').value.trim();
    var Precio = document.getElementById('Precio_Edit').value.trim();

    // Verificamos que tengamos un ID actual
    if (idActual) {
        // Actualizamos el documento en la base de datos
        var washingtonRef = db.collection("articulos").doc(idActual);
        washingtonRef.update({
            Descripcion: Descripcion,
            Nombre: Nombre,
            Precio: parseInt(Precio)
        }).then(() => {
            console.log("Documento actualizado correctamente!");
            // Limpiamos el formulario y ocultamos el formulario de edición
            document.getElementById('Descripcion_Edit').value = '';
            document.getElementById('Nombre_Edit').value = '';
            document.getElementById('Precio_Edit').value = '';
            document.getElementById("form-editar").style.display = "none";
        }).catch((error) => {
            console.error("Error al actualizar el documento: ", error);
        });
    } else {
        console.error("No hay un ID actual para actualizar.");
    }
}

// Función para cancelar la edición
function cancelar() {
    // Limpiamos el formulario y ocultamos el formulario de edición
    document.getElementById('Descripcion_Edit').value = '';
    document.getElementById('Nombre_Edit').value = '';
    document.getElementById('Precio_Edit').value = '';
    document.getElementById("form-editar").style.display = "none";
}

// Adjuntar evento de clic para el botón "Actualizar"
document.getElementById("actualizar").addEventListener("click", actualizar);

// Adjuntar evento de clic para el botón "Cancelar"
document.getElementById("cancelar").addEventListener("click", cancelar);

// Función para cargar datos en el formulario de edición al hacer clic en el botón de editar
function editar(id, Descripcion, Nombre, Precio) {
    cargarDatosEnFormulario(id, Descripcion, Nombre, Precio);
}

// Obtenemos los inputs a validar
const inputs = document.querySelectorAll('.validar');
let jugadores = []

// Expresiones regulares para las validaciones
const expRegCedula = /^[0-9]{7,11}$/;
const expRegNombres = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
const expRegEmail = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
const expRegUsuario = /^[a-zA-Z0-9]+$/;
const expRegClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,8})/;


const fechaNacimiento = document.getElementById('inp-fecha-nac');
const btnform = document.querySelector('#btn-adicionar');
// Recorremos los inputs para agregar listeners
inputs.forEach(input => {
    input.addEventListener('change', validarInput);
});

// Función manejadora del evento change
function validarInput(e) {

    // Quitamos estilos
    e.target.classList.remove('success', 'error');

    // Validación cédula
    if (e.target.id === 'inp-cedula') {
        
        if (expRegCedula.test(e.target.value)) {
            e.target.classList.add('success');
            
            
        } else {
            e.target.classList.add('error');
            
        }
        
    }
    // Validación nombres
    if (e.target.id === 'inp-nombres') {
        
        if (expRegNombres.test(e.target.value)) {
            e.target.classList.add('success');
            
        } else {
            e.target.classList.add('error');
            
        }

        
    }
    // Validación apellidos
    if (e.target.id === 'inp-apellidos') {
       
        if (expRegNombres.test(e.target.value)) {
            e.target.classList.add('success');
           
        } else {
            e.target.classList.add('error');
            
        }
        
    }
    // Fecha de nacimiento
    if (e.target.id === 'inp-fecha-nac') {
       
        const fechaNac = new Date(e.target.value);
        if (calcularEdad(fechaNac) < 18) {
            e.target.classList.add('error');
           
        } else {
            e.target.classList.add('success');
           
        }
       
    }
    // Validación correo
    if (e.target.id === 'inp-correo') {
        
        if (expRegEmail.test(e.target.value)) {
            e.target.classList.add('success');
          
        } else {
            e.target.classList.add('error');
           
        }
       
    }
    if (e.target.id === 'inp-usuario') {
        
        if (e.target.value != "") {
            e.target.classList.add('success');
            
        } else {
            e.target.classList.add('error');
           
        }
       
    }

    if (e.target.id === 'inp-contrasena') {
        
        if (expRegClave.test(e.target.value)) {
            e.target.classList.add('success');
           
        } else {
            e.target.classList.add('error');
          
        }
      
    }

    //valido que las contraseñas sean iguales
    if (e.target.id === 'inp-contrasena-con') {
       
        const password = document.getElementById("inp-contrasena").value
        if (e.target.value != password) {
            e.target.classList.add('error');
           
        } else {
            e.target.classList.add('success');
           
        }
       
    }

}

// Validación al enviar formulario
btnform.addEventListener('click', validarFormulario);

function validarFormulario(e) {

    // Revisamos que todos los inputs sean válidos
    let inputsValidos = true;

    inputs.forEach(input => {
        if (!input.classList.contains('success')) {
            input.classList.add("error")
            inputsValidos = false;
        }
    });

    if (inputsValidos) {
        const jugador = crearObjetoUsuario();
        jugadores.push(jugador);
        console.log(jugadores);

        validarJugadores();
    }

}

function validarJugadores(){

    if(jugadores.length < 2){
        Swal.fire({
            title: '¡Éxito!',
            text: 'Jugador guardado correctamente',
            icon: 'success',
            timer: 2000
        });
        limpiarInputs()
    }else{
        Swal.fire({
            title: '¡Éxito!',
            text: 'Segundo Jugador guardado, Puedes iniciar juego',
            icon: 'success',
            timer: 2000
        });       

        // Almacenar la variable jugadores en localStorage
        localStorage.setItem('jugadores', JSON.stringify(jugadores));

        setTimeout(function() {
            window.location.href = 'crucigrama.html';
        }, 2000);

    }  
}

function limpiarInputs(){
    inputs.forEach(element => {
        element.value = null
        element.classList.remove("success")
    });
}

//calcular si el que esta ingresando es mayor de 18 años
function calcularEdad(fechaNac) {
    const fechaActual = new Date();
    const diff = fechaActual.getTime() - fechaNac.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

//Crear el objeto jugador del formulario de registro
function crearObjetoUsuario() {
    const persona = {
        documento: '',
        nombres: '',
        apellidos: '',
        correo: '',
        usuario: '',
        fechaNacimiento: '',
        contrasena: '',
        puntos: 0
    }
    inputs.forEach(element => {
        if (element.id === 'inp-cedula') {
            persona.documento = element.value ? element.value : persona.documento;
        }
        if (element.id === 'inp-nombres') {
            persona.nombres = element.value ? element.value : persona.nombres;
        }
        if (element.id === 'inp-apellidos') {
            persona.apellidos = element.value ? element.value : persona.apellidos;
        }
        if (element.id === 'inp-fecha-nac') {
            persona.fechaNacimiento = element.value ? element.value : persona.fechaNacimiento;
        }
        if (element.id === 'inp-correo') {
            persona.correo = element.value ? element.value : persona.correo;
        }
        if (element.id === 'inp-usuario') {
            persona.usuario = element.value ? element.value : persona.usuario;
        }
        if (element.id === 'inp-contrasena') {
            persona.contrasena = element.value ? element.value : persona.contrasena;
        }
    });

    return persona;
}


//Poner un popUp a la fecha de Nacimiento
fechaNacimiento.addEventListener('click', () => {
    fechaNacimiento.setAttribute('title', 'Fecha de Nacimiento');
});

fechaNacimiento.addEventListener('focus', () => {
    fechaNacimiento.setAttribute('title', 'Fecha de Nacimiento');
});

fechaNacimiento.addEventListener('keyup', () => {
    fechaNacimiento.setAttribute('title', 'Fecha de Nacimiento');
});

document.getElementById("btn-regresar").addEventListener("click", function() {
    window.location.href = "../index.html";
  });
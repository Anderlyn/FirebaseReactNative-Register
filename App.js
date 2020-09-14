// Imports necesarios para el funcionamiento de la aplicación.
import React from 'react';
// Core components de React Native para que funcione la aplicación.
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Alert} from 'react-native';
// Importamos firebase junto con el subconjunto de auth, ya que solo ocupamos la parte de autenticación. 
import * as firebase from 'firebase';
import "firebase/auth";
// Por razones de seguridad, nunca suban el token a GitHub.
import {Token} from "./Auth/token";

// Componente para mostrar cuando está cargando algo, el componente ActivityIndicator es de RN y muestra un ícono de cargando.
class Loading extends React.Component{
  render(){
    return(
      <View>
        <ActivityIndicator size='large' color="#000000" />
      </View>
    );
  };
};
// Componente para mostrar el formulario de registro.
class Register extends React.Component{
  constructor(props){
    this.state = {
      password: "",
      mail: ""
    };
    this.register = this.register.bind(this);
  };
  register(){
    // Estas funciones como servicios vienen desde el componente raiz. 
    this.props.loadingService();
    this.props.registerService(this.state.mail, this.state.password);
  };
  render(){
    /*
     Cada vez que la persona ingresa algo a los inputs, cambiamos el estado para guardar el nuevo valor. 
     También, en los componentes de TextInput agrego la prop keyboardType que permite que el teclado del
     teléfono cambie adaptativamente a lo que el input recibirá. 

     Utilizamos TouchableOpacity en lugar de Button porque Button NO es personalizable!
    */
    return (
      <View style={styles.container}>
        <Text>Correo XDDDD</Text>
        <TextInput keyboardType='email-address' onChangeText={(text) => this.setState({mail: text})}></TextInput>
        <Text>Contraseña</Text>
        <TextInput secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}></TextInput>
        <TouchableOpacity onPress={this.register}>
          <Text>Registrar</Text>
        </TouchableOpacity>
      </View>
    );
  };
};
// Componente de la aplicación en general, es el primero que se carga.
export default class App extends React.Component {
  constructor(props){ 
    // Guardamos en un estado si la app está cargando y si firebase ya cargó sus componentes.
    this.state = {
      loading: true,
      firebase: false
    };
    this.registerService = this.registerService.bind(this);
    this.loadingService = this.loadingService.bind(this);
  };
  componentDidMount(){
    // Una función asíncrona para esperar a que la app se conecte con Firebase.
    const loadFirebase = async () => {
      /*
       La propiedad apps contiene las instancias de las conexiones, si es diferente de 0, ya se conectó 1 vez, todo lo que necesitamos. 
      */
      if(!firebase.apps.length){
        await firebase.initializeApp(Token);
      };
      // Si ya cargó, cambiamos el estado a firebase cargado y cargando, falso. 
      this.setState({
        firebase: true,
        loading: false
      });
    };
    // Ejecutamos la función de arriba para cargar firebase. 
    loadFirebase();
  };
  // Servicio para mostrar la pantalla de carga cuando sea necesario en algún subcomponente. 
  loadingService(){
    this.setState({loading: true});
  };
  // Servicio para registrar a la persona cuando en algún subcomponente sea necesario.
  registerService(mail, password){
    /*
      Usamos la función auth de firebase que devuelve una instancia de una clase con un método 
      "createUserWithEmailAndPassword" que toma como parametros el correo y la contraseña para
      registrar a la persona. Lean más sobre la instancia auth() aquí:
      https://firebase.google.com/docs/auth/web/password-auth
    */
    firebase.auth().createUserWithEmailAndPassword(mail, password)
    .then(()=>{
      // Si el registro fue correcto, termina de cargar y lo avisa.
      Alert.alert("Registrado Correctamente.");
      this.setState({loading: false});
    })
    .catch((error)=>{
      // Si el registro fue incorrecto, termina de cargar y muestra cuál fue el error.
      Alert.alert("Error",error.message);
      this.setState({loading: false});
    });
  };
  render(){
    // Utilizamos el renderizado condicional, si el estado cargando es cierto, muestra el componente de carga.
    if(this.state.loading){
      return (
        <Loading />
      );
    }else{
      return (
        <Register 
        registerService={this.registerService}
        loadingService={this.loadingService}
        />
      );
    };
  };
};
// Estilo boilerplate que genera Expo.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

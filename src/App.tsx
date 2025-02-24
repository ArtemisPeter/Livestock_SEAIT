import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { useEffect } from "react";
import DashBoard from "./pages/DashBoard";
import Landing from "./pages/Landing";
import AddAnimal from "./pages/AddAnimal";
import AddAnimalCategory from "./pages/AddAnimalCategory";
import AddAnimalType from "./pages/AddAnimalType";

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import Person from "./pages/Person";
import Vaccine from "./pages/Vaccine";
import Feeds from "./pages/Feeds";
import LiveStock_Feed from "./pages/LiveStock_Feed";
import Disease from "./pages/Disease";
import Livestock_Disease from "./pages/Livestock_Disease";
import AllAnimalMain from "./pages/AllAnimalMain";



setupIonicReact();

const App: React.FC = () => {

  return (

      <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/landing">
            <Landing />
          </Route>
          <Route exact path="/addAnimal">
            <AllAnimalMain />
          </Route>
          <Route exact path="/addAnimalCategory">
            <AddAnimalCategory />
          </Route>
          <Route exact path="/addAnimalType">
            <AddAnimalType />
          </Route>
          <Route exact path="/persons">
            <Person />
          </Route>
          <Route exact path="/vaccine">
            <Vaccine />
          </Route>
          <Route exact path="/feeds">
            <Feeds />
          </Route>
          
          <Route exact path="/disease">
            <Disease />
          </Route>
          <Route exact path="/livestock_feed">
            <LiveStock_Feed />
          </Route>
          <Route exact path="/livestock_disease">
            <Livestock_Disease />
          </Route>

          <Route exact path="/specAnimal/:id">
            <AddAnimal />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>

    
  );
};

export default App;
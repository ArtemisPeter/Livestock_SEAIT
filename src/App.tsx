import { Redirect, Route } from "react-router-dom";
import { IonApp, IonContent, IonRouterOutlet, setupIonicReact } from "@ionic/react";
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
import Setting from "./pages/Setting";

setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>

        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/home" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route exact path="/landing" component={Landing} />
            <Route exact path="/addAnimal" component={AllAnimalMain} />
            <Route exact path="/addAnimalCategory" component={AddAnimalCategory} />
            <Route exact path="/addAnimalType" component={AddAnimalType} />
            <Route exact path="/persons" component={Person} />
            <Route exact path="/vaccine" component={Vaccine} />
            <Route exact path="/feeds" component={Feeds} />
            <Route exact path="/disease" component={Disease} />
            <Route exact path="/livestock_feed" component={LiveStock_Feed} />
            <Route exact path="/livestock_disease" component={Livestock_Disease} />
            <Route exact path="/specAnimal/:id" component={AddAnimal} />
            <Route exact path="/Setting" component={Setting} />
          </IonRouterOutlet>
        </IonReactRouter>

    </IonApp>
  );
};

export default App;

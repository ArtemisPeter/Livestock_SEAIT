import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { playCircle, radio, library, search } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';
import Animal from './Animal';

const DashBoard: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/dashboard" to="/animal" />
          {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
          <Route path="/animal" render={() => <Animal />} exact={true} />
       
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="animal" href="/animal">
            <IonIcon icon={playCircle} />
            <IonLabel>Animal</IonLabel>
          </IonTabButton>

          <IonTabButton tab="radio" href="/radio">
            <IonIcon icon={radio} />
            <IonLabel>Radio</IonLabel>
          </IonTabButton>

          <IonTabButton tab="library" href="/library">
            <IonIcon icon={library} />
            <IonLabel>Library</IonLabel>
          </IonTabButton>

          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default DashBoard;

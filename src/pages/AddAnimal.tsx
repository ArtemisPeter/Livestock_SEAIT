import { IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { add } from "ionicons/icons";
import React from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Animal from "./Animal";

const AddAnimal: React.FC = () =>{
    return(
        <>
         <SideBar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Add Animal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <h1>shhsh</h1>
        </IonContent>
      </IonPage>
        </>
       

    );
};
export default AddAnimal
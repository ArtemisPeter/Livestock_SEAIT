import React from "react";
import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import SideBar from "./SideBar";
import Animal from "./Animal";

const Landing: React.FC = () =>{
    return(
        <>
        <SideBar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            <Animal />
        </IonContent>
      </IonPage>
        </>
       
    )
}
export default Landing;
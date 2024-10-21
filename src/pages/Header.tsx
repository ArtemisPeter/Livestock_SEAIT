import { IonButtons, IonContent, IonHeader, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonMenu, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

const Header: React.FC = () =>{
    return (
        <>
           <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        </>
    );
}
export default Header
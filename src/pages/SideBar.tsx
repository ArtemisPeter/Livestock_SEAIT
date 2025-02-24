import { IonButton, IonContent, IonHeader, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonMenu, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';



const SideBar: React.FC = () =>{
    const history = useHistory();


    return (

        <>
          <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>LiveStock</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent >

            <IonList>
                    <IonItem>
                        <IonLabel onClick={()=> {history.push('/landing')}}>Dashboard</IonLabel>
                    </IonItem>
                
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Master Data</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/persons')}}>Persons</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=> {history.push('/vaccine')}}>Vaccines & Supplements</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/feeds')}}>Feeds</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/disease')}}>Disease</IonLabel>
                    </IonItem>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Animal</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/addAnimalCategory')}}>Animals</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/addAnimalType')}}>Breed</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=> {history.push('/addAnimal')}}>LiveStock</IonLabel>
                    </IonItem>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Transaction</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel onClick={()=>history.push('/livestock_feed')}>Feed / Supplement Livestock</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=>history.push('/livestock_disease')}>Disease Livestock</IonLabel>
                    </IonItem>
                
                </IonItemGroup>
               
            </IonList>
            
        </IonContent>
      </IonMenu>
        </>
    );
}
export default SideBar
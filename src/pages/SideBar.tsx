import { IonContent, IonHeader, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";


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
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>Animal</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonLabel onClick={()=> {history.push('/landing')}}>Animals</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel onClick={()=>{history.push('/addAnimalCategory')}}>Category</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Tyoe</IonLabel>
                    </IonItem>
                </IonItemGroup>
            </IonList>

        </IonContent>
      </IonMenu>
        </>
    );
}
export default SideBar
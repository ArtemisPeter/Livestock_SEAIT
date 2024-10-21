import { IonContent, IonFab, IonHeader, IonPage, IonTitle, IonToolbar,IonFabButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonButton, IonGrid, IonRow, IonModal, IonBadge, IonCardContent, IonFabList } from "@ionic/react";
import React, { useState, useRef } from "react";
import { add } from 'ionicons/icons';

const Animal: React.FC = () => {
    const [modalOpen, setOpenModal] = useState(false)

    const modal = useRef<HTMLIonModalElement>(null);

    const handleModal = () =>{
        setOpenModal(true)
    }

    return (
       <IonPage>
       
            <IonContent className="ion-padding">
               <IonCard id="cardss" onClick={handleModal}>
                    <IonCardHeader >
                        <IonCardTitle>
                            Makoy
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonBadge slot="end">Pregrant</IonBadge>
                        <IonBadge slot="end" color={"danger"}>Sick</IonBadge>
                    </IonCardContent>
               </IonCard>
               <IonModal ref={modal} trigger="cardss" initialBreakpoint={0.5} breakpoints={[0, 1]}>
                <div className="block ion-text-center">
                    <h1>Makoy</h1>
                </div>
               </IonModal>

            </IonContent>
        <IonFab id="addAnimal" slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton>
                <IonIcon icon={add}></IonIcon>
            </IonFabButton>
            
        </IonFab>
       </IonPage>
      
    )

}
export default Animal;
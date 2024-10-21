import {
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    useIonAlert,
  } from "@ionic/react";
  import React, { useEffect, useState } from "react";
  import "./Home.css";
  import { DBSQLiteValues, SQLiteDBConnection } from "@capacitor-community/sqlite";
  import useSQLiteDB from "../composables/useSQLiteDB";
  import useConfirmationAlert from "../composables/useConfirmationAlert";
  import { useHistory } from "react-router";
  
  type SQLItem = {
    id: number;
    fname: string;
    lname: string;
    pinCode: number
  };
  
  const Login: React.FC = () => {
    const [pin, setPin] = useState<number>();
    //const [users, setUsers] = useState<Array<SQLItem>>();
    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState<Array<SQLItem>>();
    // hook for sqlite db
    const { performSQLAction, initialized } = useSQLiteDB();
    const [presentAlert] = useIonAlert();

     const history = useHistory();

    const CheckUser = async(pin: number) =>{
        try{
            performSQLAction(
                async(db: SQLiteDBConnection | undefined) => {
                    const result = await db?.query(`SELECT * FROM User WHERE pincode = ?`, [pin]);

                    if(result && result.values && result.values.length > 0){
                        setUserInfo(result.values);
                        setLogin(true);
                        history.push('/landing')
                    }else{
                        presentAlert({
                            header: 'Login Failed!',
                            buttons: ['OK'],
                        })
                    }

                }
            )
        }catch(error){
            console.log(error);
        }
    }
    
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
        <IonGrid>
            <IonRow>
                <IonCol style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <IonInput 
                        type="number"
                        placeholder="Pin Here" 
                        className="ion-text-center" 
                        style={{ marginBottom: '20px', width: '80%' }}
                        onIonInput={(e)=>setPin(e.target.value as number)}
                        value={pin}
                        >
                    </IonInput>
                    <IonButton 
                        expand="full" 
                        style={{ width: '80%' }} 
                        onClick={()=>CheckUser(pin)}>
                            Login
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
        
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;
import {
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    useIonAlert,
  } from "@ionic/react";
  import React, { useState } from "react";
  import "./Home.css";
  import { SQLiteDBConnection } from "@capacitor-community/sqlite";
  import useSQLiteDB from "../composables/useSQLiteDB";
  import { useHistory } from "react-router";
  import ReactCodeInput from "react-code-input";
  import logo from '../assets/icon.png'
  
  type SQLItem = {
    id: number;
    fname: string;
    lname: string;
    pinCode: number;
  };
  
  const Login: React.FC = () => {
    const [pin, setPin] = useState<string>(""); // Use string to store PIN for ReactCodeInput compatibility
    const { performSQLAction } = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    const history = useHistory();
  
    const CheckUser = async (pin: string) => {
      try {
        performSQLAction(async (db: SQLiteDBConnection | undefined) => {
          const result = await db?.query(`SELECT * FROM User WHERE pincode = ?`, [
            pin,
          ]);
  
          if (result && result.values && result.values.length > 0) {
            history.push("/landing"); // Navigate to the landing page
          } else {
            presentAlert({
              header: "Login Failed!",
              buttons: ["OK"],
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
  
    const handlePinChange = (value: string) => {
      setPin(value);
  
      // Trigger CheckUser automatically when PIN is complete
      if (value.length === 4) {
        CheckUser(value);
      }
    };
  
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <img src={logo} style={{ width: "50%" }} alt="Logo" />
                <p>Log in using your Passkey</p>
                <div className="ion-margin-top">
                  <ReactCodeInput
                    type="password"
                    fields={4}
                    name={"pin"}
                    inputMode={"tel"}
                    value={pin}
                    onChange={handlePinChange} // Automatically triggers when input changes
                  />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;
  
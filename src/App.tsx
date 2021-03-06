import {
  MainData,
  ApiResponse,
  DestinationType,
  Icons,
  InputValue,
} from "types";
import useAppContext from "./hooks/useContext";
import React, { useState } from "react";
import { MainBar } from "./components/MainBar";
import {
  EntireApp,
  StyledButton,
  StyledInputSection,
  StyledMainInput,
  StyledLogButton,
  StyledButtonContainer,
} from "./styles/StyleApp";
import { useNavigate } from "react-router-dom";

const handleTrimedData = (result: any) => {
  // const main = result.list.forEach((data: any) => (data.main.id = uuid()));

  const icons = result.list.map((elem: any) => elem.weather[0].main as Icons);

  const date = result.list.map((elem: any) => elem.dt_txt as ApiResponse);

  const weathers = result.list.map((elem: any) => elem.main) as MainData[];

  return [icons, date, weathers];
};

const App: React.FC = () => {
  const [destination, setDestination] = useState<DestinationType>(null);

  const { setContextValue } = useAppContext();

  let navigate = useNavigate();

  const handleLoginNavigate = () => {
    navigate("login");
  };

  const handleOnChange = (e: InputValue): void => {
    setDestination(e.target.value);
  };

  const handleGetData = async (destination: DestinationType) => {
    const API = `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=bfd9e24dfea0d5fd385e2137bce7cb95`;

    try {
      const result = await (await fetch(API)).json();

      console.log(result);
      const [icons, date, weathers] = handleTrimedData(result);

      if (!weathers) {
        throw new Error("Problem with correctness of the API response ");
      } else {
        setContextValue({ weathers, icons, date });
      }
    } catch (error) {
      throw new Error("Problem with getting the API response");
    }
  };

  return (
    <EntireApp>
      <StyledInputSection>
        <StyledMainInput
          placeholder="Wpisz miejscowość"
          type="text"
          value={destination || ""}
          onChange={handleOnChange}
        ></StyledMainInput>
        <StyledButtonContainer>
          <StyledButton onClick={() => handleGetData(destination)}>
            Szukaj
          </StyledButton>
          <StyledLogButton onClick={handleLoginNavigate}>
            Zaloguj się
          </StyledLogButton>
        </StyledButtonContainer>
      </StyledInputSection>
      <MainBar />
    </EntireApp>
  );
};

export default App;

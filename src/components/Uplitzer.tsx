import { FC, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getServerBaseUrl } from "../urlUtils";

const fileTypes = ["GIF"];

export const Uplitzer: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");

  return (
    <Host>
      <h1>Also los... würg ine!</h1>
      <PasswordField
        type="password"
        placeholder="Weisch s'Passwort?"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Wähl es Litz Bild us..."
        hoverTitle="jetzt musch loslah!"
        maxSize="12"
      />
      <StyledLink to="/">Ok ha gnueg gwürgt - zrug zum litze!</StyledLink>
    </Host>
  );

  async function handleChange(file: File) {
    const data = new FormData();
    data.append("image", file);
    data.append("password", password);

    try {
      const response = await fetch(
        `${getServerBaseUrl()}/server/upload-litz.php`,
        {
          method: "POST",
          body: data,
        }
      );
      const responseText = await response.text();

      if (response.status > 204) {
        throw new Error(`${response.status}: ${responseText}`);
      }

      navigate(`/🤦/${responseText}`);
    } catch (err) {
      console.error("Haha glitzt: ", err);
      navigate(`/mich`);
    }
  }
};

const Host = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled(Link)`
  margin-top: 15px;
  font-size: 0.75rem;
`;

const PasswordField = styled.input`
  margin-bottom: 15px;
`;

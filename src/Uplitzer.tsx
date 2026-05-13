import { FC, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link, useNavigate } from "react-router-dom";
import { getServerBaseUrl } from "./urlUtils.ts";
import s from "./Uplitzer.module.css";

export const Uplitzer: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");

  return (
    <div className={s.host}>
      <h1>Also los... würg ine!</h1>
      <input
        className={s.password}
        type="password"
        placeholder="Weisch s'Passwort?"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={["GIF"]}
        label="Wähl es Litz Bild us..."
        hoverTitle="jetzt musch loslah!"
        maxSize={12}
      />
      <Link className={s.link} to="/">
        Ok ha gnueg gwürgt - zrug zum litze!
      </Link>
    </div>
  );

  async function handleChange(fileOrFiles: File | File[]) {
    const file = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles;
    const data = new FormData();
    data.append("image", file);
    data.append("password", password);

    try {
      const response = await fetch(
        `${getServerBaseUrl()}/server/upload-litz.php`,
        {
          method: "POST",
          body: data,
        },
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

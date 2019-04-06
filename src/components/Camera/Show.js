import React from "react";

import styles from "./Show.module.css";

const Gallery = ({ data }) => {
  // receives b64 streams and

  return (
    <div className={styles.gallery}>
      {data &&
        data.map((v, i) => {
          return <img key={i} src={v} alt="img" />;
        })}
    </div>
  );
};

export default Gallery;

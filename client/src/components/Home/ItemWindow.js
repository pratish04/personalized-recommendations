import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./ItemWindow.css";

const ItemWindow = ({ item, handleItemWindow}) => {
  const [loading, setLoading] = useState(false);
  const [iiSimTagItems, setIiSimTagItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        setLoading(true);
        console.log(item.item_id);
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/similar-tag-items",
          {
            params: {
              itemId: item.item_id,
            },
            withCredentials: true,
          }
        );
        if (res.data.noToken || res.data.tokenInvalid) {
          console.log(res.data.message);
          navigate("/");
        } else {
          setIiSimTagItems(res.data.ii_sim_tag_items);
          console.log(res.data.ii_sim_tag_items);
          setLoading(false);
        }
      } catch (err) {
        alert("Some error occurred! Please try after some time!");
        console.log("Some error occurred! Please try after some time!", err);
      }
    };
    isAuthenticated();
  }, [navigate, item]);

  const createBlobFromBinary = (binaryData) => {
    const blob = new Blob([new Uint8Array(binaryData)], {
      type: "image/jpeg",
    });
    return URL.createObjectURL(blob);
  };

  return (
    <>
      <div className="item-window-con">
        <div className="selected-item">
          <div className="selected-item-image">
            <img src={createBlobFromBinary(item.item_image.data)}></img>
          </div>
          <div className="selected-item-details">
            <ul>
              <li>{item.item_name}</li>
              <li>&#8377;{item.item_price}</li>
              <li className="tags">
                Tags:{" "}
                {item.item_tags.map((tag, index) => {
                  return <span key={index}>{tag}</span>;
                })}
              </li>
            </ul>
          </div>
        </div>
        <div className="similar-items">
          <h4 style={{ margin: "-1% 0 1% 0" }}>Similar items:</h4>
          <div>
            {iiSimTagItems.map((item, index) => {
              return (
                <div className="item-tile" key={index} onClick={()=>{handleItemWindow(true, item)}}>
                  <img
                    src={createBlobFromBinary(item.item_image.data)}
                    alt={item.item_name}
                  />
                  <div onClick={() => handleItemWindow(true, item)}>
                    <ul>
                      <li>{item.item_name.substr(0, 20) + "..."}</li>
                      <li>&#8377;{item.item_price}</li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemWindow;

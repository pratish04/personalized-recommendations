import "./Items.css";

const Items = ({uiSimTagItems, handleItemWindow}) =>{
    console.log(uiSimTagItems);
    const createBlobFromBinary = (binaryData) => {
        const blob = new Blob([new Uint8Array(binaryData)], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
    };


    return (
        <>
            <div className="items-con">
                <h4 style={{margin: "-1% 0 1% 0"}}>Items of your interest:</h4>
                <div className="items-con-con">
                    {
                        uiSimTagItems.map((item, index)=>{
                            return (
                              <div className="item-tile" key={index}>
                                <img
                                  src={createBlobFromBinary(
                                    item.item_image.data
                                  )}
                                  alt={item.item_name}
                                />
                                {/* <div onClick={() => handleItemWindow(true, item)}> */}
                                <div onClick={()=>{handleItemWindow(true, item)}}>
                                  <ul>
                                    <li>
                                      {item.item_name.substr(0, 20) + "..."}
                                    </li>
                                    <li>&#8377;{item.item_price}</li>
                                  </ul>
                                </div>
                              </div>
                            );
                        })
                    }
                </div>
            </div>
        </>
    )
};

export default Items;
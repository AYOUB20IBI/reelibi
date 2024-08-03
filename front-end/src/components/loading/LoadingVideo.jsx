import Skeleton from "react-loading-skeleton";

export default function LoadingVideo() {
  return (
    <>
    <div style={{
      position: "relative",
      height: "600px",
      width: "100%",
      maxWidth: "350px",
      borderRadius: "10px",
      marginTop: "20px",
      scrollSnapType: "y mandatory",
    }} className="container-fluid">
        <div>
          <Skeleton height={250}/>
        </div>
        <div >
          <Skeleton height={20} count={10}/>
        </div>
    </div>
    </>
  )
}

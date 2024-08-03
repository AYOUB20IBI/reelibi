import Skeleton from "react-loading-skeleton";

export default function LoadingProfil() {
  return (
    <>
    <div>
        <div>
          <Skeleton height={250}/>
        </div>
        <div>
          <Skeleton height={10} count={2}/>
        </div>
        <div>
          <Skeleton height={100}/>
        </div>
        <div>
          <Skeleton height={50}/>
        </div>
    </div>
    </>
  )
}

import Skeleton from "react-loading-skeleton";

export default function LoadingComments() {
  return (
    <>
    <div>
      <Skeleton height={50} count={3}/>
    </div>
    </>
  )
}

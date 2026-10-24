

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function myContainer({className}:any) {
  return (
    <div className={`${className} container max-w-7xl mx-auto `}></div>
  )
}

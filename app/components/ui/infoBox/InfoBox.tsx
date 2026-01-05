type InfoBoxProps = {
  icon: string
  title: string
  onClick?: () => void
}

export const InfoBox = ({ icon, title, onClick }: InfoBoxProps) => {
  return (
    <div className="flex gap-2 items-center p-2 hover:underline cursor-pointer" onClick={onClick}>
      <div className="flex w-8 h-8">
        <img src={icon} alt="info_box_icon" />
      </div>
      <span>{title}</span>
    </div>
  )
}

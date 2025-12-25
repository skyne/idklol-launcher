type InfoBoxProps = {
  icon: string
  title: string
}

export const InfoBox = ({ icon, title }: InfoBoxProps) => {
  return (
    <div className="flex gap-2 items-center p-2">
      <div className="flex w-8 h-8">
        <img src={icon} alt="info_box_icon" />
      </div>
      <span>{title}</span>
    </div>
  )
}

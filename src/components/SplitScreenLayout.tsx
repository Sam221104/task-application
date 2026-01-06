
type SplitScreenProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

const SplitScreen = ({ left, right }: SplitScreenProps) => {
  return (
    <div className="container">
      {left}
      {right}
    </div>
  );
};

export default SplitScreen;

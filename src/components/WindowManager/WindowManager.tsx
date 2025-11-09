import { useWindows } from '../../contexts/WindowContext';
import { Window } from '../Window/Window';

export const WindowManager = () => {
  const { windows } = useWindows();

  return (
    <>
      {windows.map((window) => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            appIcon={window.appIcon}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            isMaximized={window.isMaximized}
          >
            {window.content}
          </Window>
        )
      ))}
    </>
  );
};

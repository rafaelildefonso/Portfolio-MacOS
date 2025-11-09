import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

type IconComponent = React.FC<IconProps>;

// Icon container style
const iconContainerStyle = (size: string | number) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: size,
  height: size,
});

// SVG style
const svgStyle: React.CSSProperties = {
  display: "block",
  margin: "auto",
  width: "100%",
  height: "100%",
  flexShrink: 0,
};

// Note: Do not use flex styles inside SVG groups; use viewBox + preserveAspectRatio for scaling

export const WifiIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => {
  return (
    <div
      style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
      className={className}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 23 16"
        preserveAspectRatio="xMidYMid meet"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
        {...props}
      >
        <g>
          <path
            d="M1.4761 6.8457C1.67141 7.03125 1.94485 7.03125 2.13039 6.83594C4.53274 4.28711 7.6968 2.93945 11.2417 2.93945C14.8062 2.93945 17.9898 4.29688 20.3726 6.8457C20.5484 7.02148 20.812 7.01172 21.0073 6.82617L22.355 5.47852C22.5308 5.30273 22.521 5.08789 22.3843 4.92188C20.0894 2.08984 15.773 0.00976562 11.2417 0.00976562C6.72024 0.00976562 2.3843 2.08984 0.0991432 4.92188C-0.0375756 5.08789-0.0375756 5.30273 0.12844 5.47852Z"
            fill={color}
            fillOpacity="0.85"
          />
          <path
            d="M5.52883 10.9277C5.74367 11.1328 6.00735 11.1035 6.20266 10.8887C7.37453 9.58984 9.2886 8.64258 11.2417 8.65234C13.2144 8.64258 15.1284 9.61914 16.3198 10.918C16.4956 11.123 16.7398 11.1133 16.9546 10.918L18.4683 9.41406C18.6245 9.25781 18.6441 9.04297 18.4976 8.86719C17.023 7.06055 14.2886 5.70312 11.2417 5.70312C8.19485 5.70312 5.46047 7.06055 3.98586 8.86719C3.83938 9.04297 3.84914 9.23828 4.01516 9.41406Z"
            fill={color}
            fillOpacity="0.85"
          />
          <path
            d="M11.2417 16.2402C11.4566 16.2402 11.6421 16.1426 12.023 15.7715L14.4058 13.4863C14.5523 13.3398 14.5913 13.125 14.4546 12.9492C13.8198 12.1289 12.6187 11.416 11.2417 11.416C9.82571 11.416 8.62453 12.1582 7.98977 13.0078C7.89211 13.1641 7.93117 13.3398 8.08742 13.4863L10.4605 15.7715C10.8413 16.1328 11.0269 16.2402 11.2417 16.2402Z"
            fill={color}
            fillOpacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
};

export const MinusIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => {
  return (
    <div
      style={{
        ...iconContainerStyle(size),
        ...(props.style || {}),
      }}
      className={className}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 16 16"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
        {...props}
      >
        <rect
          x="3"
          y="7"
          width="10"
          height="2"
          rx="1"
          fill={color}
          fillOpacity="0.85"
        />
      </svg>
    </div>
  );
};

export const ControlCenterIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 18 19"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <path
          d="M4.17969 18.4375L14.4434 18.4375C16.7578 18.4375 18.623 16.8164 18.623 14.4238C18.623 12.0312 16.7578 10.4102 14.4434 10.4102L4.17969 10.4102C1.86523 10.4102 0 12.0312 0 14.4238C0 16.8164 1.86523 18.4375 4.17969 18.4375ZM14.6973 16.9629C13.2812 16.9531 12.168 15.8203 12.168 14.4141C12.168 13.0176 13.291 11.8848 14.6973 11.8848C16.1035 11.8848 17.2461 13.0078 17.2363 14.4043C17.2266 15.8203 16.0938 16.9727 14.6973 16.9629Z"
          fill={color}
          fillOpacity="0.85"
        />
        <path
          d="M4.58008 6.76758C5.86914 6.77734 6.89453 5.72266 6.9043 4.43359C6.91406 3.1543 5.86914 2.12891 4.58008 2.12891C3.29102 2.12891 2.26562 3.16406 2.26562 4.44336C2.26562 5.73242 3.29102 6.75781 4.58008 6.76758Z"
          fill={color}
          fillOpacity="0.85"
        />
        <path
          d="M4.58008 8.90625L14.043 8.90625C16.5625 8.90625 18.623 7.10938 18.623 4.45312C18.623 1.79688 16.5625 0 14.043 0L4.58008 0C2.06055 0 0 1.79688 0 4.45312C0 7.10938 2.06055 8.90625 4.58008 8.90625ZM4.58008 7.43164C2.93945 7.43164 1.47461 6.23047 1.47461 4.45312C1.47461 2.67578 2.93945 1.47461 4.58008 1.47461L14.043 1.47461C15.6836 1.47461 17.1484 2.67578 17.1484 4.45312C17.1484 6.23047 15.6836 7.43164 14.043 7.43164Z"
          fill={color}
          fillOpacity="0.85"
        />
      </g>
    </svg>
  </div>
);

export const SearchIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 19 19"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <path
        d="M0 7.79297C0 12.0898 3.49609 15.5859 7.79297 15.5859C9.49219 15.5859 11.0449 15.0391 12.3242 14.1211L17.1289 18.9355C17.3535 19.1602 17.6465 19.2676 17.959 19.2676C18.623 19.2676 19.082 18.7695 19.082 18.1152C19.082 17.8027 18.9648 17.5195 18.7598 17.3145L13.9844 12.5098C14.9902 11.2012 15.5859 9.57031 15.5859 7.79297C15.5859 3.49609 12.0898 0 7.79297 0C3.49609 0 0 3.49609 0 7.79297ZM1.66992 7.79297C1.66992 4.41406 4.41406 1.66992 7.79297 1.66992C11.1719 1.66992 13.916 4.41406 13.916 7.79297C13.916 11.1719 11.1719 13.916 7.79297 13.916C4.41406 13.916 1.66992 11.1719 1.66992 7.79297Z"
        fill={color}
        fillOpacity="0.85"
      />
    </svg>
  </div>
);

export const XMarkIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="1 0 5 7"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <path stroke={color} stroke-width="1.2" stroke-linecap="round" d="M1.182 5.99L5.99 1.182m0 4.95L1.182 1.323"></path>
    </svg>
  </div>
);

export const FulScreenIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="1 0 11 13"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <path d="M4.871 3.553L9.37 8.098V3.553H4.871zm3.134 5.769L3.506 4.777v4.545h4.499z" fill={color}></path>
    </svg>
  </div>
);

export const TrashIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 25"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0" />
        <path
          d="M6.5625 18.6035C6.93359 18.6035 7.17773 18.3691 7.16797 18.0273L6.86523 7.57812C6.85547 7.23633 6.61133 7.01172 6.25977 7.01172C5.88867 7.01172 5.64453 7.24609 5.6543 7.58789L5.94727 18.0273C5.95703 18.3789 6.20117 18.6035 6.5625 18.6035ZM9.45312 18.6035C9.82422 18.6035 10.0879 18.3691 10.0879 18.0273L10.0879 7.58789C10.0879 7.24609 9.82422 7.01172 9.45312 7.01172C9.08203 7.01172 8.82812 7.24609 8.82812 7.58789L8.82812 18.0273C8.82812 18.3691 9.08203 18.6035 9.45312 18.6035ZM12.3535 18.6035C12.7051 18.6035 12.9492 18.3789 12.959 18.0273L13.252 7.58789C13.2617 7.24609 13.0176 7.01172 12.6465 7.01172C12.2949 7.01172 12.0508 7.23633 12.041 7.58789L11.748 18.0273C11.7383 18.3691 11.9824 18.6035 12.3535 18.6035ZM5.16602 4.46289L6.71875 4.46289L6.71875 2.37305C6.71875 1.81641 7.10938 1.45508 7.69531 1.45508L11.1914 1.45508C11.7773 1.45508 12.168 1.81641 12.168 2.37305L12.168 4.46289L13.7207 4.46289L13.7207 2.27539C13.7207 0.859375 12.8027 0 11.2988 0L7.58789 0C6.08398 0 5.16602 0.859375 5.16602 2.27539ZM0.732422 5.24414L18.1836 5.24414C18.584 5.24414 18.9062 4.90234 18.9062 4.50195C18.9062 4.10156 18.584 3.76953 18.1836 3.76953L0.732422 3.76953C0.341797 3.76953 0 4.10156 0 4.50195C0 4.91211 0.341797 5.24414 0.732422 5.24414ZM4.98047 21.748L13.9355 21.748C15.332 21.748 16.2695 20.8398 16.3379 19.4434L17.0215 5.05859L15.4492 5.05859L14.7949 19.2773C14.7754 19.8633 14.3555 20.2734 13.7793 20.2734L5.11719 20.2734C4.56055 20.2734 4.14062 19.8535 4.11133 19.2773L3.41797 5.05859L1.88477 5.05859L2.57812 19.4531C2.64648 20.8496 3.56445 21.748 4.98047 21.748Z"
          fill={color}
          fill-opacity="0.85"
        />
      </g>
    </svg>
  </div>
);

export const ThemeIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0" />
        <path
          d="M9.96094 20.0098C15.4102 20.0098 19.9219 15.4883 19.9219 10.0488C19.9219 4.59961 15.4199 0.0878906 9.96094 0.0878906C4.53125 0.0878906 0 4.59961 0 10.0488C0 15.4883 4.52148 20.0098 9.96094 20.0098ZM9.96094 18.3496C5.35156 18.3496 1.65039 14.6582 1.66016 10.0488C1.66992 5.43945 5.36133 1.74805 9.96094 1.74805Z"
          fill={color}
          fill-opacity="0.85"
        />
      </g>
    </svg>
  </div>
);

export const ShareIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 2 16 22"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0" />
        <path
          d="M17.334 10.7617L17.334 20.5078C17.334 22.5195 16.3086 23.5352 14.2676 23.5352L3.06641 23.5352C1.02539 23.5352 0 22.5195 0 20.5078L0 10.7617C0 8.75 1.02539 7.73438 3.06641 7.73438L6.00586 7.73438L6.00586 9.30664L3.08594 9.30664C2.10938 9.30664 1.57227 9.83398 1.57227 10.8496L1.57227 20.4199C1.57227 21.4355 2.10938 21.9629 3.08594 21.9629L14.2383 21.9629C15.2051 21.9629 15.7617 21.4355 15.7617 20.4199L15.7617 10.8496C15.7617 9.83398 15.2051 9.30664 14.2383 9.30664L11.3281 9.30664L11.3281 7.73438L14.2676 7.73438C16.3086 7.73438 17.334 8.75 17.334 10.7617Z"
          fill={color}
          fill-opacity="0.85"
        />
        <path
          d="M8.66211 15.8887C9.08203 15.8887 9.44336 15.5371 9.44336 15.127L9.44336 5.09766L9.38477 3.63281L10.0391 4.32617L11.5234 5.9082C11.6602 6.06445 11.8555 6.14258 12.0508 6.14258C12.4512 6.14258 12.7637 5.84961 12.7637 5.44922C12.7637 5.24414 12.6758 5.08789 12.5293 4.94141L9.22852 1.75781C9.0332 1.5625 8.86719 1.49414 8.66211 1.49414C8.4668 1.49414 8.30078 1.5625 8.0957 1.75781L4.79492 4.94141C4.64844 5.08789 4.57031 5.24414 4.57031 5.44922C4.57031 5.84961 4.86328 6.14258 5.27344 6.14258C5.45898 6.14258 5.67383 6.06445 5.81055 5.9082L7.28516 4.32617L7.94922 3.63281L7.89062 5.09766L7.89062 15.127C7.89062 15.5371 8.24219 15.8887 8.66211 15.8887Z"
          fill={color}
          fill-opacity="0.85"
        />
      </g>
    </svg>
  </div>
);

export const ImportIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 2 20 22"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0" />
        <path
          d="M17.334 10.1953L17.334 19.9414C17.334 21.9531 16.3086 22.9688 14.2676 22.9688L3.06641 22.9688C1.02539 22.9688 0 21.9531 0 19.9414L0 10.1953C0 8.18359 1.02539 7.16797 3.06641 7.16797L6.00586 7.16797L6.00586 8.74023L3.08594 8.74023C2.10938 8.74023 1.57227 9.26758 1.57227 10.2832L1.57227 19.8535C1.57227 20.8691 2.10938 21.3965 3.08594 21.3965L14.2383 21.3965C15.2051 21.3965 15.7617 20.8691 15.7617 19.8535L15.7617 10.2832C15.7617 9.26758 15.2051 8.74023 14.2383 8.74023L11.3281 8.74023L11.3281 7.16797L14.2676 7.16797C16.3086 7.16797 17.334 8.18359 17.334 10.1953Z"
          fill={color}
          fill-opacity="0.85"
        />
        <path
          d="M8.66211 16.543C8.86719 16.543 9.0332 16.4844 9.22852 16.2891L12.5293 13.0957C12.6758 12.9492 12.7637 12.793 12.7637 12.5879C12.7637 12.1875 12.4512 11.9043 12.0508 11.9043C11.8555 11.9043 11.6602 11.9824 11.5234 12.1387L10.0391 13.7109L9.38477 14.4043L9.44336 12.9395L9.44336 2.64648C9.44336 2.23633 9.08203 1.88477 8.66211 1.88477C8.24219 1.88477 7.89062 2.23633 7.89062 2.64648L7.89062 12.9395L7.94922 14.4043L7.28516 13.7109L5.81055 12.1387C5.67383 11.9824 5.45898 11.9043 5.27344 11.9043C4.86328 11.9043 4.57031 12.1875 4.57031 12.5879C4.57031 12.793 4.64844 12.9492 4.79492 13.0957L8.0957 16.2891C8.30078 16.4844 8.4668 16.543 8.66211 16.543Z"
          fill={color}
          fill-opacity="0.85"
        />
      </g>
    </svg>
  </div>
);

export const StarIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 2 22 18"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0"/>
        <path d="M4.16109 20.5469C4.56149 20.8594 5.0693 20.752 5.67477 20.3125L10.8408 16.5137L16.0166 20.3125C16.622 20.752 17.1201 20.8594 17.5302 20.5469C17.9306 20.2441 18.0185 19.7461 17.7744 19.0332L15.7334 12.959L20.9482 9.20898C21.5537 8.7793 21.7978 8.33008 21.6416 7.8418C21.4853 7.37305 21.0263 7.13867 20.2744 7.14844L13.8779 7.1875L11.9345 1.08398C11.7002 0.361328 11.3486 0 10.8408 0C10.3427 0 9.99117 0.361328 9.7568 1.08398L7.81344 7.1875L1.41695 7.14844C0.665001 7.13867 0.206017 7.37305 0.0497668 7.8418C-0.116249 8.33008 0.137657 8.7793 0.743126 9.20898L5.95797 12.959L3.91695 19.0332C3.67281 19.7461 3.7607 20.2441 4.16109 20.5469ZM5.56734 18.6133C5.54781 18.5938 5.55758 18.584 5.56734 18.5254L7.5107 12.9395C7.64742 12.5586 7.5693 12.2559 7.2275 12.0215L2.36422 8.66211C2.31539 8.63281 2.30563 8.61328 2.31539 8.58398C2.32516 8.55469 2.34469 8.55469 2.40328 8.55469L8.31149 8.66211C8.71188 8.67188 8.96578 8.50586 9.09274 8.10547L10.792 2.45117C10.8017 2.39258 10.8213 2.37305 10.8408 2.37305C10.8701 2.37305 10.8896 2.39258 10.8994 2.45117L12.5986 8.10547C12.7255 8.50586 12.9795 8.67188 13.3798 8.66211L19.288 8.55469C19.3466 8.55469 19.3662 8.55469 19.3759 8.58398C19.3857 8.61328 19.3662 8.63281 19.3271 8.66211L14.4638 12.0215C14.122 12.2559 14.0439 12.5586 14.1806 12.9395L16.124 18.5254C16.1338 18.584 16.1435 18.5938 16.124 18.6133C16.1045 18.6426 16.0752 18.623 16.0361 18.5938L11.3388 15.0098C11.0263 14.7656 10.665 14.7656 10.3525 15.0098L5.65524 18.5938C5.61617 18.623 5.58688 18.6426 5.56734 18.6133Z" fill={color} fill-opacity="0.85"/>
      </g>
    </svg>
  </div>
);

export const DraftIcon: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div
    style={{ ...iconContainerStyle(size), ...(props.style || {}) }}
    className={className}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <rect x="0" y="0"/>
        <path d="M15.5591 4.88935L6.08643 4.88935C5.10986 4.88935 4.56299 5.41669 4.56299 6.43232L4.56299 17.5163C4.56299 18.5319 5.10986 19.0495 6.08643 19.0495L17.2095 19.0495C18.186 19.0495 18.7231 18.5319 18.7231 17.5163L18.7231 8.12957L20.2954 6.55445L20.2954 17.5944C20.2954 19.6159 19.27 20.6218 17.229 20.6218L6.05713 20.6218C4.02588 20.6218 2.99072 19.6159 2.99072 17.5944L2.99072 6.34443C2.99072 4.33271 4.02588 3.31708 6.05713 3.31708L17.1313 3.31708Z" fill={color} fill-opacity="0.85"/>
        <path d="M9.61182 14.2936L11.5161 13.4636L20.6372 4.35224L19.2993 3.03388L10.188 12.1452L9.30908 13.9811C9.23096 14.1472 9.42627 14.3718 9.61182 14.2936ZM21.3599 3.63935L22.063 2.91669C22.395 2.56513 22.395 2.09638 22.063 1.77412L21.8384 1.53974C21.5356 1.23701 21.0571 1.27607 20.7349 1.58857L20.022 2.29169Z" fill={color} fill-opacity="0.85"/>
      </g>
    </svg>
  </div>
);
// Add more icons below following the same pattern
// Example:
/*
export const IconName: IconComponent = ({
  size = "1em",
  color = "currentColor",
  className = "",
  ...props
}) => (
  <div style={{ ...iconContainerStyle(size), ...(props.style || {}) }} className={className}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={svgStyle}
      {...props}
    >
      <g>
        <path d="..." />
      </g>
    </svg>
  </div>
);
*/

export const LinkedinPreview = () => {
  return (
    <div className="relative flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-7 select-none">
      <div className="ring-foreground/10 relative rounded-md ring-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 552 138"
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-4/1 w-full rounded-md"
          aria-hidden="true"
        >
          <g className="dark:hidden">
            <path fill="#d9e5e7" d="M0 0h552v138H0z" />
            <path fill="#bfd3d6" d="M380 0h172v138H380z" />
            <path
              fill="#a0b4b7"
              d="M333.22 0H0v138h333.22a207.93 207.93 0 0 0 0-138"
            />
          </g>

          <g className="hidden dark:inline">
            <path fill="#3c4345" d="M0 0h552v138H0z" />
            <path fill="#5b696b" d="M380 0h172v138H380z" opacity="0.5" />
            <path
              fill="#5b696b"
              d="M333.22 0H0v138h333.22a207.93 207.93 0 0 0 0-138"
            />
          </g>
        </svg>

        <div className="absolute inset-s-0 bottom-0 ms-2 flex w-fit translate-y-1/2 items-baseline gap-0.5">
          <img
            src="https://media.licdn.com/dms/image/v2/C5603AQFxeLAzWTafhA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1646927091363?e=1790812800&v=beta&t=NIu2M_zFPcj2Kpev6DswjjrFR6v2DSSFb_85P4EGP98"
            alt=""
            draggable={false}
            className="outline-popover size-14 rounded-full outline-2 -outline-offset-2"
          />

          <a
            href="https://linkedin.com/in/achmad-anshori"
            target="_blank"
            rel="noreferrer"
            className="w-fit -translate-y-1.5 cursor-alias text-base font-semibold underline-offset-4 hover:underline"
          >
            Achmad Anshori
          </a>
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-muted-foreground flex flex-col px-1">
          <span>Software Engineer</span>
          <span>Jakarta, Indonesia</span>
        </div>
      </div>
    </div>
  )
}

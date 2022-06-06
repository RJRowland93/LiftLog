import React,  from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { createStyles, Navbar,  } from "@mantine/core";
// import {
//   BellRinging,
//   Fingerprint,
//   Key,
//   Settings,
//   TwoFA,
//   DatabaseImport,
//   Receipt2,
//   SwitchHorizontal,
//   Logout,
// } from "tabler-icons-react";
// import { MantineLogo } from "../../shared/MantineLogo";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === "dark"
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 5 : 7
            ],
        },
      },
    },
  };
});

const data = [
  { link: "/workout", label: "Workout", icon: "" },
  { link: "/graph", label: "Graph", icon: "" },
  { link: "/calendar", label: "Calendar", icon: "" },
];

function useIsActive() {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  // isActive('/signup')
  return isActive;
}

function AuthButton() {
  const { data: session, status } = useSession();
  const isActive = useIsActive();

  if (status === "loading") {
    return (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>Log in</a>
        </Link>
      </div>
    );
  }
  if (session) {
    return (
      <button onClick={() => signOut()}>
        <a>Log out</a>
      </button>
    );
  }
}

type Props = {
  hidden: boolean;
};

export const Navigation: React.FC<Props> = ({ hidden }) => {
  const { classes, cx } = useStyles();
  const isActive = useIsActive();

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      {/* <item.icon className={classes.linkIcon} /> */}
      <a
        className={cx(classes.link, {
          [classes.linkActive]: isActive(item.link),
        })}
      >
        {item.label}
      </a>
    </Link>
  ));

  return (
    <Navbar hidden={hidden} height={700} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        {/* <Group className={classes.header} position="apart">
          <MantineLogo />
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>  */}
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <AuthButton />
      </Navbar.Section>
    </Navbar>
  );
};

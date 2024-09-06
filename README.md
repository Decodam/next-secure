# next-secure-cli

# next-secure

`next-secure` is a CLI tool to add authentication to your Next.js project. It helps you set up authentication components, configuration files, and run necessary installation commands with ease.

## Installation

You can install `next-secure` globally using npm:

```bash
npm install -g next-secure
```

Alternatively, you can use `npx` to run it without installing globally:

```bash
npx next-secure
```

## Usage

Run `next-secure` in your Next.js project directory to set up authentication:

- `-help` or `h`: Display help information.

## What It Does

1. **Copies Directories**:
    - Copies the `public` directory from the `template` folder to your project, skipping existing files.
    - Copies the `_schemas` directory from the `template` folder to your project root.
    - Copies the contents of the `src` directory from the `template` folder to the existing `src` directory in your project, or to the root if `src` does not exist.
2. **Installs Dependencies**:
    - Installs `next-auth@beta`, `nodemailer`, `@prisma/client`, `@auth/prisma-adapter`, and `prisma`.
3. **Runs Initialization Commands**:
    - Initializes `shadcn` with a set of components.
    - Initializes Prisma.
4. **Creates Configuration Files**:
    - Creates or appends to `.env` and `.env.local` with necessary configuration settings.

## Configuration

After running `next-secure`, you need to:

1. **Generate Auth Secret**:
    - Run `openssl rand -base64 32` to generate the auth secret.
2. **Update `.env` and `.env.local`**:
    - Add OAuth provider details, email provider details, and database URL to the respective `.env` files.
3. **Add OAuth Providers**:
    - Configure the OAuth providers in `@/auth/provider.js`.

## Documentation

For more details and advanced usage, please refer to the [documentation](https://github.com/Decodam/nextsecure#readme).

## License

This project is licensed under the ISC License - see the [LICENSE](https://www.notion.so/LICENSE) file for details.

## Contributing

If you would like to contribute to this project, please submit a pull request or open an issue.

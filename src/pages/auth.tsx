import AuthInput from '@/components/AuthInput';
import * as z from 'zod';
import axios from 'axios';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { use, useCallback, useState } from 'react';
import { useRouter } from 'next/router';

const schema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

export async function getServerSideProps(context: NextPageContext) {
  // * This fuction check if the user has an existing session and redirect it to homepage
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
}

const Auth = () => {
  const router = useRouter();
  const [formMode, setFormMode] = useState('login');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
  });

  const toggleFormMode = useCallback(() => {
    setFormMode((currentFormMode) =>
      currentFormMode === 'login' ? 'register' : 'login'
    );
  }, [formMode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { email, name, password } = formData;

  const register = useCallback(async () => {
    try {
      const registerSchema = schema.merge(
        z.object({
          name: z.string().min(6),
        })
      );
      registerSchema.parse(formData);

      await axios
        .post('/api/register', {
          email,
          name,
          password,
        })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            login();
          } else {
            console.log('Something went wrong');
          }
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
    }
  }, [name, email, password]);

  const login = useCallback(async () => {
    try {
      schema.parse(formData);
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      }
    }
  }, [email, password]);

  return (
    <main className="flex h-full w-full items-center justify-center bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="flex flex-col w-[400px] min-h-[200px] bg-black/70 p-5">
        <h1 className="text-3xl text-gray-100 font-bold uppercase text-center">
          {formMode === 'login' ? 'SIGN IN' : 'REGISTER'}
        </h1>
        {formMode === 'register' && (
          <AuthInput
            id="name"
            label="name"
            type="text"
            onChange={handleInputChange}
            value={formData.name}
            error={formErrors.name}
          />
        )}

        <AuthInput
          id="email"
          label="email"
          type="text"
          onChange={handleInputChange}
          value={formData.email}
          error={formErrors.email}
        />
        <AuthInput
          id="password"
          label="password"
          type="password"
          onChange={handleInputChange}
          value={formData.password}
          error={formErrors.password}
        />

        <button
          className="w-auto mt-4 mx-2 py-4 uppercase bg-red-900 text-gray-300 rounded-xl hover:bg-red-800/70 hover:text-gray-200 font-bold"
          onClick={formMode === 'login' ? login : register}
        >
          {formMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
        <p
          className="flex w-full h-full mt-4 text-gray-100 p-3 font-semibold text-md"
          onClick={() => {}}
        >
          {formMode === 'login'
            ? 'Do you want an account?'
            : 'You already have an account?'}
          <span
            onClick={toggleFormMode}
            className="text-red-800 underline cursor-pointer ml-2 uppercase"
          >
            {formMode === 'login' ? 'SIGN UP HERE' : 'SIGN IN HERE'}
          </span>
        </p>
      </div>
    </main>
  );
};

export default Auth;

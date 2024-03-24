"use client";
import { api } from "@/trpc/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  isInterested: boolean;
};

const Categories = () => {
  const router = useRouter();
  const [num, setNum] = useState(0);
  const userId = Cookies.get("userId");
  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [router, userId]);
  const { data, refetch } = api.category.getAll.useQuery({
    num: num,
    userId: userId ? parseInt(userId) : -1,
  });
  const upodateCategory = api.category.updateCategory.useMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetchData = async () => {
    await refetch();
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    refetchData();
  }, [refetchData, upodateCategory]);

  return (
    <>
      <form className="form-container mx-auto my-4 flex flex-col gap-4 bg-white px-10 py-4">
        <h1 className="text-center text-xl font-bold">
          Please mark your interests!
        </h1>
        <div className="flex flex-col text-center">
          <h2 className="text-center text-lg font-semibold">
            We will keep you notified.
          </h2>
          {/* <p>email</p> */}
        </div>
        <div className="flex flex-col">
          <h2 className="text-start text-lg font-semibold">
            My Saved Interests!
          </h2>
        </div>
        {!!data &&
          data.map((eachProduct: Product) => {
            return (
              <div
                className="flex flex-row items-center gap-4"
                key={eachProduct.id}
              >
                <input
                  type="checkbox"
                  name={eachProduct.id.toString()}
                  id={eachProduct.id.toString()}
                  onChange={(e) => {
                    upodateCategory.mutate({
                      categoryId: eachProduct.id,
                      userId: userId ? parseInt(userId) : -1,
                      isInterested: e.target.checked,
                    });
                  }}
                  className="h-[24px] w-[24px] text-[#000000] accent-black rounded border-0"
                  checked={eachProduct.isInterested}
                  disabled={upodateCategory.isPending}
                />
                <label
                  htmlFor={eachProduct.id.toString()}
                  className="font-400 text-[16px] leading-3 text-[#000000]"
                >
                  {eachProduct.name}
                </label>
              </div>
            );
          })}

        <div className="flex flex-row justify-between">
          {num > 0 && (
            <button type="button" onClick={() => setNum((num) => num - 1)}>
              Previous Page
            </button>
          )}
          {num < 14 && (
            <button
              type="button"
              onClick={() => setNum((num) => num + 1)}
              className="align-items-end flex justify-end"
            >
              Next Page
            </button>
          )}
        </div>
      </form>
      <div className="flex flex-row">
        <button
          type="button"
          onClick={() => {
            Cookies.remove("userId");
            router.push("/login");
          }}
          className="w-100 submit-button mx-auto h-[36px] bg-slate-900 px-20 text-center text-[#FFFFFF]"
        >
          Logout
        </button>
      </div>
    </>
  );
};
export default Categories;

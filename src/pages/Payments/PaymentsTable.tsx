import { shortenNumber } from "../../utils/shortenNumber";
import ContextMenu from "../../components/ContextMenu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import constants from "../../data/constants";

interface PaymentTableProps {
  data: any,
  viewPayment: (property_id: number|string)=> void,
  editPayment: false|((property_id: number|string)=> void),
}
 
const PaymentsTable: React.FC<PaymentTableProps> = ({data, viewPayment, editPayment}) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Payment Info
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Created At
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Type
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((p: any) => (
                <tr key={p.id}>
                  <td onClick={()=>viewPayment(p.id)} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {p.account_name}
                    </h5>
                    <p className="text-sm">{p.bank} ({p.account_number})</p>
                    <p className="text-sm">{(!p.sale)? '-' : [p.sale.title, p.sale.first_name, p.sale.last_name].join(' ')} ({(!p.sale || !p.sale.property)? '-' : [p.sale.property.name, p.sale.property.short_description].join(' ')})</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p 
                      className="text-black dark:text-white"
                      dangerouslySetInnerHTML={ { __html: '&#8358;'+shortenNumber(p.amount) } }
                    ></p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        p.realtor_id? 'bg-success text-success' : 'bg-zinc-400 text-black'
                      }`}
                    >
                      {
                        p.type == constants.paymentType.UPLINER_COMMISSION? 'UPLINER_COMMISSION' : 
                        p.type == constants.paymentType.COMMISSION? 'COMMISSION' : 'SALE'
                      }
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <ContextMenu
                        trigger={
                          <button className="text-primary hover:text-default">
                            <EllipsisVerticalIcon className="min-w-5 max-w-5 fill-current" />
                          </button>
                        }
                        items={[
                          { label: 'View', action: () => viewPayment(p.id) },
                          ...((editPayment) ? [{ label: 'Edit', action: () => editPayment(p.id) }] : []),
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {
        (data.length == 0) &&
        <div className='px-2 pt-24'>
          <p className="text-3xl text-center">No payments to show.</p>
        </div>
      }
    </>
  );
};

export default PaymentsTable;

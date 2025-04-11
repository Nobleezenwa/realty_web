import React from 'react';
import Dialog from '../../components/Dialog';
import { useDashboardController, setBusy } from '../../context';
import { request } from '../../utils/request';
import config from '../../data/config';
import { formatNumber } from '../../utils/formats';

const CommissionDialog: React.FC<any> = ({ closeFn, successFn, failFn, data }) => {
  const {commissions, sale} = data;

  const [controller, dispatch] = useDashboardController();
  const { userSession } = controller;

  const checks: any = {};
  commissions.forEach((c: any) => {
    checks[c.id] = false;
  });

  const [checkedRows, setCheckedRows] = React.useState<{ [key: string]: boolean }>( checks );
  const allChecked = Object.values(checkedRows).every(Boolean);

  const handleCheckboxChange = (id: string) => {
    setCheckedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setBusy(dispatch, true);

    const formData = new FormData();
    formData.append(`sale_id`, sale.id);
    formData.append(`commissions`, JSON.stringify(commissions));

    commissions.forEach((commission: any) => {
      Object.keys(commission).forEach((key) => {
        formData.append(`commission_${commission.id}_${key}`, commission[key]);
      });
    });

    await request({
      method: 'POST',
      url: config.backend + '/api/payment/commission',
      headers: { 'Authorization': `Bearer ${userSession.token}` },
      formData: formData,
      callback: successFn,
      onError: failFn,
    });

    setBusy(dispatch, false);
  };

  const title = `Commissions (Sale ID: ${sale.id})`;

  return (
    <Dialog title={title} closeFn={closeFn}>
      <div className="mb-4">
        <h2 className="font-bold text-black text-center text-black dark:text-white">{sale.title} {sale.first_name} {sale.last_name}</h2>
        <img src={config.storagePath + '/' + (sale.property? sale.property.display_image : '')} alt="Property" className="w-1/2 mx-auto" />
        <p className="font-medium text-center text-black dark:text-white">{(sale.property? sale.property.name : '')}</p>
        <p className="font-bold text-center text-black dark:text-white">&#8358;{formatNumber(sale.property.price)}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left border-b border-gray-300 px-1 py-2">User</th>
              <th className="text-center border-b border-gray-300 px-1 py-2">Bank</th>
              <th className="text-center border-b border-gray-300 px-1 py-2">Account Number</th>
              <th className="text-center border-b border-gray-300 px-1 py-2">Rate</th>
              <th className="text-center border-b border-gray-300 px-1 py-2">Amount</th>
              <th className="border-b border-gray-300 px-1 py-2">Paid</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission: any) => (
              <tr key={commission.id}>
                <td className="border-b border-gray-300 px-1 py-2 text-black dark:text-white">
                  {commission.account_name}
                  <br />
                  <span className="text-sm text-gray-500">({commission.username})</span>
                </td>
                <td className="text-center border-b border-gray-300 px-1 py-2 text-black dark:text-white">{commission.bank}</td>
                <td className="text-center border-b border-gray-300 px-1 py-2 text-black dark:text-white">{commission.account_number}</td>
                <td className="text-center border-b border-gray-300 px-1 py-2 text-black dark:text-white">{commission.rate}%</td>
                <td className="font-medium text-center border-b border-gray-300 px-1 py-2 text-black dark:text-white">&#8358;{formatNumber(commission.amount)}</td>
                <td className="text-center border-b border-gray-300 px-1 py-2">
                  <input
                    type="checkbox"
                    checked={checkedRows[commission.id]}
                    onChange={() => handleCheckboxChange(commission.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {userSession.as === 'admin' && (
          <div className="mt-4 flex justify-center">
            <input
              type="submit"
              value="Submit"
              disabled={!allChecked}
              className={`cursor-pointer items-center justify-center py-4 px-10 text-center font-medium text-white ${
                allChecked ? 'bg-primary hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
              }`}
            />
          </div>
        )}
      </form>
    </Dialog>
  );
};

export default CommissionDialog;
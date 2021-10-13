import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const delivered = await order.save();
    await db.disconnect();
    res.send({ message: 'order delivered', order: delivered });
  } else {
    await db.disconnect();
    res.status(401).send({ message: 'order not found' });
  }
});

export default handler;

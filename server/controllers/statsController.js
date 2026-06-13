import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Treatment } from '../models/Treatment.js';
import { User } from '../models/User.js';
import { Consultation } from '../models/Consultation.js';
import { Contact } from '../models/Contact.js';

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalTreatments = await Treatment.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Appointments breakdown
    const appointmentsCount = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Consultations callback breakdown
    const consultationsCount = await Consultation.countDocuments();
    const newConsultations = await Consultation.countDocuments({ status: 'new' });
    const contactedConsultations = await Consultation.countDocuments({ status: 'contacted' });

    // Contacts breakdown
    const contactsCount = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ isRead: false });

    // Recent activities (recent 5 appointments)
    const recentAppointments = await Appointment.find()
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          doctors: totalDoctors,
          treatments: totalTreatments,
          patients: totalPatients,
          appointments: {
            total: appointmentsCount,
            pending: pendingAppointments,
            confirmed: confirmedAppointments,
            completed: completedAppointments,
            cancelled: cancelledAppointments,
          },
          consultations: {
            total: consultationsCount,
            new: newConsultations,
            contacted: contactedConsultations,
          },
          contacts: {
            total: contactsCount,
            unread: unreadContacts,
          },
        },
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

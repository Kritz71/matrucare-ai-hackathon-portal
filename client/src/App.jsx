
import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Trophy,
  Users,
  Rocket,
  CalendarDays,
  ShieldCheck,
  Mail,
  CheckCircle2,
  ExternalLink,
  Pencil,
  LoaderCircle,
  HeartPulse
} from 'lucide-react';

import toast from 'react-hot-toast';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { api } from './lib/api';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" />
        Checking your session…
      </div>
    );
  }

  return user
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-first innovation',
      text: 'Build meaningful solutions across emerging technology tracks.'
    },
    {
      icon: Users,
      title: 'Learn together',
      text: 'Bring your team, exchange ideas and grow with a community.'
    },
    {
      icon: Trophy,
      title: 'Get recognised',
      text: 'Put your work in front of mentors and an expert jury.'
    }
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            NATIONAL HACKATHON · 2026
          </div>

          <h1>
            Build what<br />
            <em>matters.</em>
          </h1>

          <p className="hero-copy">
            A national platform for bold ideas, thoughtful technology
            and solutions that create real-world impact.
          </p>

          <div className="hero-actions">
            <Link
              className="button button-light"
              to={user ? '/register-hackathon' : '/signup'}
            >
              Register for the hackathon <ArrowUpRight size={17} />
            </Link>

            <Link
              className="button button-ghost"
              to={user ? '/dashboard' : '/login'}
            >
              {user ? 'Go to dashboard' : 'Participant login'}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hero-meta">
            <span><CalendarDays size={15} /> 2026 edition</span>
            <span><ShieldCheck size={15} /> Verified participant portal</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-card art-back">
            <span className="art-label">IDEA / 026</span>
            <div className="art-grid" />
            <span className="art-back-text">
              IMAGINE<br />THE NEXT.
            </span>
          </div>

          <div className="art-card art-front">
            <div className="art-top">
              <HeartPulse size={18} />
              <span>MATRUCARE AI</span>
            </div>

            <div className="pulse-line">
              <span /><span /><span /><span />
              <span /><span /><span />
            </div>

            <div className="art-caption">
              Technology<br />with purpose.
            </div>

            <div className="art-number">
              01 <small>— 04</small>
            </div>
          </div>

          <div className="floating-tag">
            <SparklesIcon /> IDEAS INTO IMPACT
          </div>
        </div>

        <div className="hero-scroll">
          SCROLL TO EXPLORE <span />
        </div>
      </section>

      <section className="stats-strip">
        <div><strong>01</strong><span>National platform</span></div>
        <div><strong>05</strong><span>Team members max.</span></div>
        <div><strong>∞</strong><span>Possibilities to build</span></div>
      </section>

      <section className="section section-light" id="about">
        <div className="section-heading">
          <div>
            <div className="eyebrow eyebrow-dark">WHY PARTICIPATE</div>
            <h2>
              More than a<br />
              <em>competition.</em>
            </h2>
          </div>

          <p>
            Turn curiosity into a working prototype. Collaborate with
            people who think differently, challenge assumptions and
            build something useful.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="feature-card" key={title}>
              <div className="feature-number">0{index + 1}</div>
              <div className="feature-icon"><Icon size={23} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section timeline-section">
        <div className="eyebrow">THE JOURNEY</div>

        <h2>
          From first thought<br />
          to <em>final pitch.</em>
        </h2>

        <div className="timeline-grid">
          {[
            'Registration opens',
            'Team formation',
            'Prototype submission',
            'Grand finale'
          ].map((value, index) => (
            <div className="timeline-item" key={value}>
              <span>0{index + 1}</span>
              <div className="timeline-line" />
              <h3>{value}</h3>
              <p>
                {[
                  'Create your account and secure your place.',
                  'Bring together a team of curious builders.',
                  'Shape your idea into a working demonstration.',
                  'Present your solution and celebrate the journey.'
                ][index]}
              </p>
            </div>
          ))}
        </div>

        <p className="timeline-note">
          Official dates and event updates will be shared by the organising team.
        </p>
      </section>

      <section className="section awards-section">
        <div className="eyebrow eyebrow-dark">THE RECOGNITION</div>

        <div className="awards-heading">
          <h2>
            Good ideas<br />
            deserve a <em>stage.</em>
          </h2>

          <p>
            Bring your strongest work. Stand out through creativity,
            execution and the impact your solution can make.
          </p>
        </div>

        <div className="awards-grid">
          <article>
            <span>01 / WINNER</span>
            <Trophy size={25} />
            <h3>First place</h3>
            <p>National-level recognition</p>
          </article>

          <article>
            <span>02 / RUNNER-UP</span>
            <Trophy size={25} />
            <h3>Second place</h3>
            <p>Project showcase opportunity</p>
          </article>

          <article>
            <span>03 / FINALIST</span>
            <Trophy size={25} />
            <h3>Third place</h3>
            <p>Recognition for your work</p>
          </article>
        </div>

        <p className="timeline-note">
          Specific prize details and eligibility will be announced by the organising team.
        </p>
      </section>

      <section className="cta-band">
        <div>
          <div className="eyebrow">YOUR IDEA HAS A PLACE HERE</div>
          <h2>
            Ready to make<br />
            <em>something count?</em>
          </h2>
        </div>

        <Link
          className="button button-light"
          to={user ? '/register-hackathon' : '/signup'}
        >
          Get started <ArrowUpRight size={17} />
        </Link>
      </section>
    </>
  );
}

function SparklesIcon() {
  return <span className="sparkles-mini">✳</span>;
}

function AuthShell({ eyebrow, title, description, children }) {
  return (
    <section className="auth-page">
      <div className="auth-aside">
        <div className="eyebrow">MATRUCARE AI · 2026</div>

        <h2>
          Big ideas<br />
          start with<br />
          <em>one step.</em>
        </h2>

        <p>Join a community building technology with purpose.</p>

        <div className="aside-stamp">
          <SparklesIcon /> BUILD THE NEXT
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="eyebrow eyebrow-dark">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const change = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  async function submit(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setBusy(true);

    try {
      const { data } = await api.post('/api/auth/signup', form);
      sessionStorage.setItem('matrucare_pending_email', data.email);
      toast.success(data.message);
      navigate('/verify-otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="CREATE YOUR ACCOUNT"
      title="Start here."
      description="Create your participant account. We’ll send a one-time code to verify your email."
    >
      <form className="form-stack" onSubmit={submit}>
        <Field
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={change}
          placeholder="Your full name"
          autoComplete="name"
          required
          minLength="3"
        />

        <Field
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={change}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Field
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength="8"
          required
        />

        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={change}
          placeholder="Enter password again"
          autoComplete="new-password"
          required
        />

        <button className="button button-dark button-full" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(600);
  const [email] = useState(
    sessionStorage.getItem('matrucare_pending_email') || ''
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  async function verify(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const { data } = await api.post('/api/auth/verify-otp', {
        email,
        otp
      });

      toast.success(data.message);
      sessionStorage.removeItem('matrucare_pending_email');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    try {
      const { data } = await api.post('/api/auth/resend-otp', { email });
      setSeconds(600);
      setOtp('');
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code.');
    }
  }

  return (
    <AuthShell
      eyebrow="EMAIL VERIFICATION"
      title="Check your inbox."
      description={`Enter the six-digit code sent to ${email || 'your email address'}. It expires after ten minutes.`}
    >
      {!email ? (
        <div className="notice">
          No pending email found. <Link to="/signup">Create your account</Link> first.
        </div>
      ) : (
        <form className="form-stack" onSubmit={verify}>
          <Field
            label="6-digit verification code"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength="6"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            required
            pattern="[0-9]{6}"
          />

          <div className="otp-timer">
            <span>Code expires in</span>
            <b>{clock}</b>
          </div>

          <button
            className="button button-dark button-full"
            disabled={busy || otp.length !== 6}
          >
            {busy ? 'Verifying…' : 'Verify email'}
            <ArrowRight size={17} />
          </button>

          <button type="button" className="text-button" onClick={resend}>
            Resend verification code
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data);
      toast.success('Welcome back.');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="PARTICIPANT LOGIN"
      title="Welcome back."
      description="Sign in to continue to your hackathon workspace."
    >
      <form className="form-stack" onSubmit={submit}>
        <Field
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          autoComplete="email"
          required
          placeholder="you@example.com"
        />

        <Field
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          autoComplete="current-password"
          required
          placeholder="Your password"
        />

        <button className="button button-dark button-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Log in'}
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="auth-switch">
        New to MatruCare AI? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}

const colleges = [
  'Other',
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'IIT Roorkee',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Surathkal',
  'BITS Pilani',
  'VIT Vellore',
  'Manipal Institute of Technology',
  'Bharati Vidyapeeth College of Engineering',
  'COEP Technological University',
  'Pune Institute of Computer Technology',
  'Delhi Technological University',
  'IIIT Hyderabad'
];

function RegistrationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: '',
    collegeName: '',
    course: '',
    branch: '',
    yearOfStudy: '',
    domain: '',
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamSize: '1',
    teamMembers: []
  });

  const size = Number(form.teamSize);

  function update(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'teamSize'
        ? {
            teamMembers: Array.from(
              { length: Number(value) === 1 ? 0 : Number(value) },
              (_, index) => current.teamMembers[index] || {
                memberName: '',
                memberEmail: ''
              }
            )
          }
        : {})
    }));
  }

  function updateMember(index, key, value) {
    setForm((current) => ({
      ...current,
      teamMembers: current.teamMembers.map((member, i) =>
        i === index ? { ...member, [key]: value } : member
      )
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const { data } = await api.post('/api/hackathon/register', form);
      toast.success(data.message);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration could not be submitted.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-container form-page">
      <div className="page-intro">
        <div className="eyebrow eyebrow-dark">PARTICIPANT APPLICATION</div>
        <h1>Make it <em>official.</em></h1>
        <p>Tell us about your project and the people building it. Fields marked with * are required.</p>
      </div>

      <form className="registration-form" onSubmit={submit}>
        <div className="form-section">
          <div className="form-section-title">
            <span>01</span>
            <div>
              <h2>Participant details</h2>
              <p>Basic information for your registration.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field label="Full name *" name="fullName" value={form.fullName} onChange={update} minLength="3" required />
            <Field label="Email address *" type="email" name="email" value={form.email} readOnly required />
            <Field label="Mobile number *" name="mobile" type="tel" inputMode="numeric" maxLength="10" pattern="[6-9][0-9]{9}" placeholder="10-digit Indian number" value={form.mobile} onChange={update} required />
            <SelectField label="College name *" name="collegeName" value={form.collegeName} onChange={update} options={colleges} required />
            <SelectField label="Course *" name="course" value={form.course} onChange={update} options={['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BSc', 'MSc', 'Other']} required />
            <SelectField label="Branch *" name="branch" value={form.branch} onChange={update} options={['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'AI & DS', 'Other']} required />
            <SelectField label="Year of study *" name="yearOfStudy" value={form.yearOfStudy} onChange={update} options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other']} required />
            <SelectField label="Domain / track *" name="domain" value={form.domain} onChange={update} options={['AI/ML', 'Web Development', 'IoT', 'Cyber Security', 'Blockchain', 'HealthTech', 'Other']} required />
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">
            <span>02</span>
            <div>
              <h2>Project details</h2>
              <p>Share what you are planning to build.</p>
            </div>
          </div>

          <div className="form-grid">
            <Field label="Project name *" name="projectName" minLength="5" value={form.projectName} onChange={update} placeholder="Your project title" required />
            <Field label="PPT link *" name="pptLink" type="url" value={form.pptLink} onChange={update} placeholder="https://…" required />
            <Field label="Prototype link *" name="prototypeLink" type="url" value={form.prototypeLink} onChange={update} placeholder="GitHub, Figma or live demo URL" required />
            <Field label="Demo video link (optional)" name="demoVideoLink" type="url" value={form.demoVideoLink} onChange={update} placeholder="YouTube or Drive URL" />
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">
            <span>03</span>
            <div>
              <h2>Your team</h2>
              <p>Select your team size. Solo entries do not need extra member details.</p>
            </div>
          </div>

          <div className="form-grid team-size-row">
            <SelectField label="Team size *" name="teamSize" value={form.teamSize} onChange={update} options={['1', '2', '3', '4', '5']} required />
            <div className="team-size-hint">
              <Users size={18} />
              <span>{size === 1 ? 'Solo participant' : `${size} team member detail entries required`}</span>
            </div>
          </div>

          {size > 1 && (
            <div className="member-grid">
              {form.teamMembers.map((member, index) => (
                <div className="member-card" key={index}>
                  <div className="member-heading">TEAM MEMBER 0{index + 1}</div>
                  <Field
                    label="Member name *"
                    value={member.memberName}
                    onChange={(event) => updateMember(index, 'memberName', event.target.value)}
                    required
                  />
                  <Field
                    label="Member email *"
                    type="email"
                    value={member.memberEmail}
                    onChange={(event) => updateMember(index, 'memberEmail', event.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-submit-row">
          <p>By submitting, you confirm that the information provided is accurate.</p>
          <button className="button button-dark" disabled={busy}>
            {busy ? 'Submitting…' : 'Submit registration'}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function refresh() {
    try {
      const [profile, registration] = await Promise.all([
        api.get('/api/user/me'),
        api.get('/api/hackathon/my-entry')
      ]);

      setUser(profile.data.user);
      setName(profile.data.user.fullName);
      setEntry(registration.data.registration);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function saveName() {
    setSaving(true);

    try {
      const { data } = await api.put('/api/user/update', { fullName: name });
      setUser(data.user);
      localStorage.setItem('matrucare_user', JSON.stringify(data.user));
      setEditing(false);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function withdraw() {
    if (!window.confirm('Withdraw your hackathon registration? This cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/api/hackathon/${entry._id}`);
      setEntry(null);
      toast.success('Registration withdrawn.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not withdraw registration.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" />
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow eyebrow-dark">PARTICIPANT WORKSPACE</div>
          <h1>
            Hello, {user?.fullName?.split(' ')[0] || 'there'}<em>.</em>
          </h1>
          <p>Your MatruCare AI Hackathon 2026 overview.</p>
        </div>

        <div className="avatar">
          {user?.fullName?.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card profile-card">
          <div className="card-topline">
            <span>YOUR PROFILE</span>
            <button className="icon-button" onClick={() => setEditing(!editing)} aria-label="Edit profile">
              <Pencil size={16} />
            </button>
          </div>

          {editing ? (
            <div className="edit-profile">
              <Field label="Full name" value={name} onChange={(event) => setName(event.target.value)} />

              <div className="inline-actions">
                <button className="button button-dark" onClick={saveName} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>

                <button
                  className="text-button"
                  onClick={() => {
                    setEditing(false);
                    setName(user.fullName);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>{user?.fullName}</h2>
              <p>{user?.email}</p>
              <div className="verified-line">
                <CheckCircle2 size={16} /> Email verified
              </div>
            </>
          )}
        </section>

        <section className="dashboard-card entry-card">
          <div className="card-topline">
            <span>HACKATHON REGISTRATION</span>
            <span className={`status-pill ${entry ? 'status-done' : 'status-pending'}`}>
              {entry ? 'SUBMITTED' : 'NOT REGISTERED'}
            </span>
          </div>

          {entry ? (
            <>
              <div className="entry-title-row">
                <div>
                  <h2>{entry.projectName}</h2>
                  <p>{entry.domain} · {entry.collegeName}</p>
                </div>
                <div className="entry-check"><CheckCircle2 size={23} /></div>
              </div>

              <div className="entry-details">
                <div><span>COURSE / BRANCH</span><b>{entry.course} · {entry.branch}</b></div>
                <div><span>YEAR OF STUDY</span><b>{entry.yearOfStudy}</b></div>
                <div><span>TEAM SIZE</span><b>{entry.teamSize}</b></div>
              </div>

              <div className="entry-links">
                <a href={entry.pptLink} target="_blank" rel="noreferrer">Presentation <ExternalLink size={14} /></a>
                <a href={entry.prototypeLink} target="_blank" rel="noreferrer">Prototype <ExternalLink size={14} /></a>
                {entry.demoVideoLink && (
                  <a href={entry.demoVideoLink} target="_blank" rel="noreferrer">Demo video <ExternalLink size={14} /></a>
                )}
              </div>

              {entry.teamMembers?.length > 0 && (
                <div className="members-table">
                  <h3>Team members</h3>
                  {entry.teamMembers.map((member, index) => (
                    <div key={index}>
                      <b>{member.memberName}</b>
                      <span>{member.memberEmail}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="withdraw-button" onClick={withdraw} disabled={deleting}>
                {deleting ? 'Withdrawing…' : 'Withdraw registration'}
              </button>
            </>
          ) : (
            <div className="empty-entry">
              <div className="empty-icon"><Rocket size={25} /></div>
              <h2>Your next chapter starts here.</h2>
              <p>You haven’t submitted a hackathon registration yet. Add your project and team details to complete your entry.</p>
              <button className="button button-dark" onClick={() => navigate('/register-hackathon')}>
                Register now <ArrowRight size={17} />
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="dashboard-footnote">
        <ShieldCheck size={16} /> Your account is secured. Keep your login details private.
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  function submit(event) {
    event.preventDefault();

    const subject = encodeURIComponent('MatruCare AI Hackathon enquiry');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    window.location.href = `mailto:matrucareai@gmail.com?subject=${subject}&body=${body}`;
    toast.success('Opening your email application.');
  }

  return (
    <div className="contact-page page-container">
      <div className="contact-copy">
        <div className="eyebrow eyebrow-dark">GET IN TOUCH</div>
        <h1>
          Questions?<br />
          <em>Let’s talk.</em>
        </h1>

        <p>
          Need help with registration or have a question about the hackathon?
          Reach the organising team.
        </p>

        <a className="contact-email" href="mailto:matrucareai@gmail.com">
          <Mail size={19} /> matrucareai@gmail.com <ArrowUpRight size={16} />
        </a>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <Field
          label="Your name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />

        <Field
          label="Email address"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />

        <label className="field">
          <span>Message</span>
          <textarea
            rows="5"
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
            placeholder="How can we help?"
          />
        </label>

        <button className="button button-dark button-full">
          Prepare email <ArrowUpRight size={17} />
        </button>

        <p className="form-note">
          This opens your default email application; no message is stored on this website.
        </p>
      </form>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/register-hackathon" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;

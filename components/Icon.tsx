
import React from 'react';
import {
  // UI & General
  Activity,
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BadgePercent,
  Banknote,
  BarChart2,
  Bell,
  Book,
  Bookmark,
  Box,
  Briefcase,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  Cloud,
  Code,
  Coins,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Flag,
  Folder,
  Gift,
  Globe,
  Grid,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Layers,
  Layout,
  Link,
  List,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Package,
  Paperclip,
  Pause,
  Pen,
  Percent,
  Play,
  Plus,
  Power,
  RefreshCw,
  Save,
  Search,
  SearchX,
  Send,
  Settings,
  Share,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Slash,
  Sliders,
  Star,
  Tag,
  Tags,
  Terminal,
  ThumbsUp,
  Trash,
  Trash2,
  Truck,
  Type,
  Unlock,
  Upload,
  User,
  Video,
  Wallet,
  Wifi,
  X,
  Zap,
  ZoomIn,
  ZoomOut,

  // Aderezos y Condimentos
  FlaskConical,
  Droplet,
  Flame,
  UtensilsCrossed,

  // Útiles del Hogar
  Armchair,
  Bath,
  Bed,
  BedDouble,
  Blinds,
  Brush,
  DoorOpen,
  Eraser,
  Fan,
  Flashlight,
  Flower,
  Lamp,
  LampCeiling,
  LampFloor,
  Lightbulb,
  PaintBucket,
  PaintRoller,
  Plug,
  Sofa,
  Table,
  Timer,

  // Aseo y Belleza
  Feather,
  Pill,
  Scissors,
  Smile,
  Sparkles,
  SprayCan,
  Stethoscope,
  Syringe,
  Thermometer,

  // Bebidas (Alcohol y No Alcohol)
  Beer,
  Citrus,
  Coffee,
  CupSoda,
  GlassWater,
  Martini,
  Milk,
  Wine,
  WineOff,

  // Cárnicos y Embutidos
  Beef,
  Bone,
  Drumstick,
  Fish,

  // Confituras
  Cake,
  Candy,
  CandyCane,
  Cookie,
  Donut,
  IceCream,
  Lollipop,
  Popsicle,

  // Despensa
  Bean,
  Croissant,
  Egg,
  Nut,
  Pizza,
  Popcorn,
  Sandwich,
  Soup,
  Utensils,
  Vegan,
  Wheat,

  // Juguetería
  Baby,
  Dices,
  Gamepad,
  Gamepad2,
  Ghost,
  Joystick,
  PartyPopper,
  Puzzle,
  Rocket,
  Skull,
  ToyBrick,

  // Electrodomésticos
  AirVent,
  Microwave,
  Monitor,
  Radio,
  Refrigerator,
  Speaker,
  Tv,
  WashingMachine,

  // Viandas y Verduras
  Apple,
  Banana,
  Carrot,
  Cherry,
  Grape,
  Leaf,
  Salad,
  Sprout,

  // Eventos
  Clapperboard,
  Disc,
  Film,
  Megaphone,
  Music,
  Ticket,
  Palmtree,

  // Prendas (Ropa y Accesorios)
  Crown,
  Diamond,
  Footprints,
  Gem,
  Glasses,
  GraduationCap,
  Pocket,
  Shirt,
  Umbrella,
  Watch,

  // Servicios
  ConciergeBell,
  Construction,
  Hammer,
  Hand,
  Headphones,
  Key,
  Scale,
  Wrench,

  // Teléfonos Móviles
  Battery,
  BatteryCharging,
  Phone,
  Signal,
  Smartphone,
  SmartphoneCharging,
  Tablet,

  // Motos y Vehículos
  Bike,
  Bus,
  Car,
  Navigation,
  Plane,
  Train
} from 'lucide-react';

const Icons = {
  // --- UI General ---
  Activity, AlertCircle, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award,
  BadgePercent, Banknote, BarChart2, Bell, Book, Bookmark, Box, Briefcase,
  Calendar, Camera, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  Circle, Clock, Cloud, Code, Coins, Copy, CreditCard, DollarSign, Download,
  Edit, Edit2, ExternalLink, Eye, EyeOff, FileText, Filter, Flag, Folder,
  Gift, Globe, Grid, Heart, HelpCircle, Home, Image, Info, Layers, Layout,
  Link, List, Lock, LogIn, LogOut, Mail, Map, MapPin, Menu, MessageCircle,
  Mic, Minus, MoreHorizontal, MoreVertical, Package, Paperclip, Pause, Pen, Percent,
  Play, Plus, Power, RefreshCw, Save, Search, SearchX, Send, Settings, Share,
  Shield, ShoppingBag, ShoppingCart, Slash, Sliders, Star, Tag, Tags, Terminal,
  ThumbsUp, Trash, Trash2, Truck, Type, Unlock, Upload, User, Video, Wallet,
  Wifi, X, Zap, ZoomIn, ZoomOut,

  // --- Aderezos ---
  FlaskConical, Droplet, Flame, UtensilsCrossed,

  // --- Útiles del Hogar ---
  Armchair, Bath, Bed, BedDouble, Blinds, Brush, DoorOpen, Eraser, Fan,
  Flashlight, Flower, Lamp, LampCeiling, LampFloor, Lightbulb, PaintBucket,
  PaintRoller, Plug, Sofa, Table, Timer,

  // --- Aseo y Belleza ---
  Feather, Pill, Scissors, Smile, Sparkles, SprayCan, Stethoscope, Syringe, Thermometer,

  // --- Bebidas ---
  Beer, Citrus, Coffee, CupSoda, GlassWater, Martini, Milk, Wine, WineOff,

  // --- Cárnicos y Embutidos ---
  Beef, Bone, Drumstick, Fish,

  // --- Confituras ---
  Cake, Candy, CandyCane, Cookie, Donut, IceCream, Lollipop, Popsicle,

  // --- Despensa ---
  Bean, Croissant, Egg, Nut, Pizza, Popcorn, Sandwich, Soup, Utensils, Vegan, Wheat,

  // --- Juguetería ---
  Baby, Dices, Gamepad, Gamepad2, Ghost, Joystick, PartyPopper, Puzzle, Rocket,
  Skull, ToyBrick,

  // --- Electrodomésticos ---
  AirVent, Microwave, Monitor, Radio, Refrigerator, Speaker, Tv, WashingMachine,

  // --- Viandas y Verduras ---
  Apple, Banana, Carrot, Cherry, Grape, Leaf, Salad, Sprout,

  // --- Eventos ---
  Clapperboard, Disc, Film, Megaphone, Music, Ticket, Palmtree,

  // --- Prendas ---
  Crown, Diamond, Footprints, Gem, Glasses, GraduationCap, Pocket, Shirt,
  Umbrella, Watch,

  // --- Servicios ---
  ConciergeBell, Construction, Hammer, Hand, Headphones, Key, Scale, Wrench,

  // --- Teléfonos Móviles ---
  Battery, BatteryCharging, Phone, Signal, Smartphone, SmartphoneCharging, Tablet,

  // --- Motos y Vehículos ---
  Bike, Bus, Car, Navigation, Plane, Train
};

export type IconName = keyof typeof Icons;
export const ICON_LIST = Object.keys(Icons) as IconName[];

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', onClick, strokeWidth = 1.5, style }) => {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    return null;
  }

  return (
    <span 
      onClick={onClick} 
      className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      style={style}
    >
      <LucideIcon size={size} strokeWidth={strokeWidth} />
    </span>
  );
};

export default Icon;

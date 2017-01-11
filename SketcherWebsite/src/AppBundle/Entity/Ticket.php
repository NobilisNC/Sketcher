<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ticket
 *
 * @ORM\Table(name="ticket")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TicketRepository")
 */
class Ticket
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
    *  @ORM\ManyToOne(targetEntity="User", inversedBy="tickets")
     * @ORM\JoinColumn(name="user", referencedColumnName="id", onDelete="cascade")
    */
    private $author;

    /**
     * @var string
     *
     * @ORM\Column(name="title", nullable=false, type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="content", nullable=false, type="text")
     */
    private $content;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="dateEmit", nullable=false, type="datetime")
     */
    private $dateEmit;

    /**
    * @var string
    * @ORM\Column(type="string", columnDefinition="ENUM('waiting', 'processed')")
    */
    private $status;


    public function __construct() {
        $this->dateEmit = new \DateTime();
        $this->status = 'waiting';
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Ticket
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Ticket
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set dateEmit
     *
     * @param \DateTime $dateEmit
     *
     * @return Ticket
     */
    public function setDateEmit($dateEmit)
    {
        $this->dateEmit = $dateEmit;

        return $this;
    }

    /**
     * Get dateEmit
     *
     * @return \DateTime
     */
    public function getDateEmit()
    {
        return $this->dateEmit;
    }

    /**
     * Set author
     *
     * @param \AppBundle\Entity\User $author
     *
     * @return Ticket
     */
    public function setAuthor(\AppBundle\Entity\User $author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return \AppBundle\Entity\User
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return Ticket
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }
}
